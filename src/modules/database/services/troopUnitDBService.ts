import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TroopUnits } from '../schemas/troop-units.schema';
import { TroopUnitReportDto } from 'src/modules/troop-report/dtos/troop-unit-report';
import { User } from '../schemas/users.schema';
import { UserDBService } from './userDbService';
import { TroopStatus, UserType } from 'src/enums';
import { TroopDetailDBService } from './troopDetailDBService';
import { convertTimeStampToStartDay } from 'src/utils/time.helper';
import { Model, ObjectId } from 'mongoose';
import { TroopUnitGetDetailReportDto } from 'src/modules/troop-report/dtos/troop-unit-get-detail';
import { UnitDBService } from './unitDBService';
import {
  TroopEachType,
  TroopLeftReasonType,
  TroopReportType,
} from 'src/types/troop-report';
import { LIST_TROOP_STATUS, LIST_USER_TYPES, MAX_ITEM_QUERYS } from 'src/const';
import { QueryParams } from 'src/interface/i-base-db-service';
import { Unit } from '../schemas/units.schema';
import { Types } from 'mongoose';

@Injectable()
export class TroopUnitDBService extends BaseDBService<TroopUnits> {
  @Inject(UserDBService)
  userDBService: UserDBService;

  @Inject(TroopDetailDBService)
  tropDetailDBService: TroopDetailDBService;

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @InjectModel(User.name)
  userModel: Model<User>;

  constructor(@InjectModel(TroopUnits.name) private readonly entityModel) {
    super(entityModel);
  }

  async insertOrUpdate(entity) {
    const res = await this.getFirstItem({
      time: entity.time,
      unit: entity.unit,
      user_report: entity.user_report,
    });

    if (!res) {
      const ans = await this.insertItem(entity);
      return ans;
    }

    const ans = await this.updateItem(res._id, entity);
    return ans;
  }

  async addReportUnit(user: User, data: TroopUnitReportDto) {
    const checkPermisison = await this.unitDBService.checkUnitIsDescenants(
      user.unit.toString(),
      data.unit.toString(),
    );
    if (!checkPermisison) throw new ForbiddenException();

    const time = convertTimeStampToStartDay(data.time);
    const item: TroopUnits = await this.insertOrUpdate({
      time,
      unit: data.unit,
      user_report: user._id,
    });

    const users = await this.userDBService.getUsersOfUnit(data.unit.toString());

    const promises: Promise<any>[] = [];
    for (let index = 0; index < users.length; index++) {
      let status: TroopStatus = TroopStatus.CoMat;
      const user = users[index];

      try {
        const ind = data.absentTroops.findIndex(
          (i) => i.user.toString() === user._id.toString(),
        );
        if (ind !== -1) status = data.absentTroops[ind].reason;
      } catch {}

      const detailItem = {
        time,
        status,
        user: users[index]._id.toString(),
        report: item._id as ObjectId,
      };

      promises.push(this.tropDetailDBService.insertOrUpdate(detailItem));
    }

    await Promise.all(promises);
    return true;
  }

  async getReportDetail(
    unitId: string,
    data: TroopUnitGetDetailReportDto,
  ): Promise<TroopReportType> {
    const time = convertTimeStampToStartDay(data.time);

    const id: string = data.unitId ? data.unitId.toString() : unitId;

    const unit = await this.unitDBService.getItemById(id);
    const units = await this.unitDBService.getAllDescendants(id);

    const unitsId = units.map((i) => i._id.toString());

    const users = (
      await this.userDBService.getItems({
        filter: {
          unit: {
            $in: unitsId,
          },
          isPersonal: true,
        },
        skip: 0,
        limit: MAX_ITEM_QUERYS,
      })
    ).items;
    const userIds = users.map((u) => u._id.toString());

    const ans: TroopReportType = {
      time,
      total: 0,
      totalReport: 0,
      totalAttendance: 0,
      totalLeft: 0,
      name: unit.name,
      troopEachTypes: [],
      leftReasons: [],
    };

    ans.total = await this.userDBService.countByFilter({
      unit: {
        $in: unitsId,
      },
      isPersonal: true,
    });
    ans.totalReport = await this.tropDetailDBService.countByFilter({
      user: {
        $in: userIds,
      },
      time,
    });
    ans.totalLeft = await this.tropDetailDBService.countByFilter({
      user: {
        $in: userIds,
      },
      time,
      status: {
        $in: LIST_TROOP_STATUS,
      },
    });
    ans.totalAttendance = ans.total - ans.totalLeft;

    const troopEachTypes: Array<TroopEachType> = [];

    for (let index = 0; index < LIST_USER_TYPES.length; index++) {
      const type = LIST_USER_TYPES[index];
      const item: TroopEachType = {
        type,
        totalLeft: 0,
        total: 0,
        totalAttendance: 0,
      };

      const userTypeIds = users
        .filter((u) => u.type === type)
        .map((i) => i._id.toString());

      item.total = await this.userDBService.countByFilter({
        unit: {
          $in: unitsId,
        },
        type,
        isPersonal: true,
      });

      item.totalLeft = await this.tropDetailDBService.countByFilter({
        user: {
          $in: userTypeIds,
        },
        time,
        status: {
          $in: LIST_TROOP_STATUS,
        },
      });

      item.totalAttendance = item.total - item.totalLeft;

      if (item.total > 0) troopEachTypes.push(item);
    }
    ans.troopEachTypes = troopEachTypes;

    const leftReasons: Array<TroopLeftReasonType> = [];
    for (let index = 0; index < LIST_TROOP_STATUS.length; index++) {
      const status = LIST_TROOP_STATUS[index];
      const item: TroopLeftReasonType = {
        status,
        number: 0,
      };

      item.number = await this.tropDetailDBService.countByFilter({
        user: {
          $in: userIds,
        },
        time,
        status: status,
      });

      if (item.number > 0) leftReasons.push(item);
    }
    ans.leftReasons = leftReasons;

    return ans;
  }

  async getUnitReportStatus(unitUserId: string, unitId: string, time: number) {
    const timeExact = convertTimeStampToStartDay(time);

    const unit = await this.unitDBService.getItemById(unitId);
    const childs = await this.unitDBService.getListChild(unitId);
    const ans = unit;

    const count = await this.countByFilter({
      unit: unit._id.toString(),
      time: timeExact,
    });
    const countUser = await this.userDBService.countByFilter({
      unit: unit._id.toString(),
      isPersonal: true,
    });
    const isReport = !(count === 0 && countUser > 0);
    ans.isReport = isReport;
    ans.troop_info = await this.getTroopNumberOfUnit(unitUserId, unitId, time);

    const items = [];
    for (let index = 0; index < childs.length; index++) {
      const item = await this.getUnitReportStatus(
        unitUserId,
        childs[index]._id.toString(),
        time,
      );
      items.push(item);
    }
    ans.childs = items;

    return ans;
  }

  async getUserTroopStatusOfUnitAndChilds(
    userUnitId: string,
    unitId: string,
    time: number = 0,
    query: QueryParams,
  ) {
    const unit = await this.unitDBService.getItemById(unitId);
    if (!unit) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitIsDescenants(
      userUnitId,
      unitId,
    );
    if (!checkPermisison) throw new ForbiddenException();

    const timeExact = convertTimeStampToStartDay(time);
    let { sort, filter } = query;
    const { textSearch, skip, limit } = query;

    if (textSearch && textSearch !== '')
      filter = {
        ...filter,
        ...{
          $text: {
            $search: `"${textSearch}"`,
          },
        },
      };

    sort = {
      ...sort,
      ...{
        _id: 1,
      },
    };

    const queryDb: any = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'units',
          let: {
            unit: '$unit',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$unit'],
                },
              },
            },
          ],
          as: 'unit_infos',
        },
      },
      {
        $set: {
          unit_info: {
            $arrayElemAt: ['$unit_infos', 0],
          },
        },
      },
      {
        $unset: 'unit_infos',
      },
      {
        $match: {
          'unit_info.key': {
            $regex: unitId.toString(),
            $options: 'i',
          },
        },
      },
      {
        $project: {
          password: 0,
        },
      },
      {
        $lookup: {
          from: 'troopdetails',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$$id' }, '$user'],
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: [
                    {
                      $toString: '$time',
                    },
                    { $toString: timeExact },
                  ],
                },
              },
            },
          ],
          as: 'troop_info',
        },
      },
      {
        $set: {
          troop_info: {
            $arrayElemAt: ['$troop_info', 0],
          },
        },
      },
    ];

    const ans = await this.userModel
      .aggregate([
        ...queryDb,
        {
          $sort: sort,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .exec();
    const res_total = await this.userModel.aggregate([
      ...queryDb,
      {
        $count: 'total',
      },
    ]);

    const total = res_total[0] ? res_total[0].total : 0;
    const pageIndex = skip / limit + 1;

    return {
      items: ans,
      total: total,
      size: limit,
      page: pageIndex,
      offset: skip,
    };
  }

  async getUserTroopStatusOfUnit(
    userUnitId: string,
    unitId: string,
    time: number = 0,
    query: QueryParams,
  ) {
    const unit = await this.unitDBService.getItemById(unitId);
    if (!unit) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitIsDescenants(
      userUnitId,
      unitId,
    );
    if (!checkPermisison) throw new ForbiddenException();

    const timeExact = convertTimeStampToStartDay(time);
    let { sort, filter } = query;
    const { textSearch, skip, limit } = query;

    if (textSearch && textSearch !== '')
      filter = {
        ...filter,
        ...{
          $text: {
            $search: `"${textSearch}"`,
          },
        },
      };

    sort = {
      ...sort,
      ...{
        _id: 1,
      },
    };

    const queryDb: any = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'units',
          let: {
            unit: '$unit',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$unit'],
                },
              },
            },
          ],
          as: 'unit_infos',
        },
      },
      {
        $set: {
          unit_info: {
            $arrayElemAt: ['$unit_infos', 0],
          },
        },
      },
      {
        $unset: 'unit_infos',
      },
      {
        $match: {
          unit: unitId,
        },
      },
      {
        $project: {
          password: 0,
        },
      },
      {
        $lookup: {
          from: 'troopdetails',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$$id' }, '$user'],
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: [
                    {
                      $toString: '$time',
                    },
                    { $toString: timeExact },
                  ],
                },
              },
            },
          ],
          as: 'troop_info',
        },
      },
      {
        $set: {
          troop_info: {
            $arrayElemAt: ['$troop_info', 0],
          },
        },
      },
    ];

    const ans = await this.userModel
      .aggregate([
        ...queryDb,
        {
          $sort: sort,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .exec();
    const res_total = await this.userModel.aggregate([
      ...queryDb,
      {
        $count: 'total',
      },
    ]);

    const total = res_total[0] ? res_total[0].total : 0;
    const pageIndex = skip / limit + 1;

    return {
      items: ans,
      total: total,
      size: limit,
      page: pageIndex,
      offset: skip,
    };
  }

  async getTroopNumberOfUnit(
    userUnitId: string,
    unitId: string,
    time: number = 0,
  ) {
    const unit = await this.unitDBService.getItemById(unitId);
    if (!unit) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitIsDescenants(
      userUnitId,
      unitId,
    );
    if (!checkPermisison) throw new ForbiddenException();

    const filter = { isPersonal: true };
    const timeExact = convertTimeStampToStartDay(time);

    const queryDb: any = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'units',
          let: {
            unit: '$unit',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$unit'],
                },
              },
            },
          ],
          as: 'unit_infos',
        },
      },
      {
        $set: {
          unit_info: {
            $arrayElemAt: ['$unit_infos', 0],
          },
        },
      },
      {
        $unset: 'unit_infos',
      },
      {
        $match: {
          'unit_info.key': {
            $regex: unitId.toString(),
            $options: 'i',
          },
        },
      },
    ];

    // call total
    const resTotal = await this.userModel.aggregate([
      ...queryDb,
      {
        $count: 'total',
      },
    ]);
    const total = resTotal[0] ? resTotal[0].total : 0;

    // call total leave
    const resTotalLeave = await this.userModel.aggregate([
      ...queryDb,
      {
        $lookup: {
          from: 'troopdetails',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$$id' }, '$user'],
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: [
                    {
                      $toString: '$time',
                    },
                    { $toString: timeExact },
                  ],
                },
              },
            },
          ],
          as: 'troop_info',
        },
      },
      {
        $match: {
          'troop_info.status': {
            $ne: TroopStatus.CoMat,
          },
        },
      },
      {
        $set: {
          troop_info: {
            $arrayElemAt: ['$troop_info', 0],
          },
        },
      },
      {
        $count: 'total',
      },
    ]);
    const totalLeave = resTotalLeave[0] ? resTotalLeave[0].total : 0;

    return {
      total: total,
      totalAttendance: total - totalLeave,
      totalLeave: totalLeave,
    };
  }
}
