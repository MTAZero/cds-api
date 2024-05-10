import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Inject, Injectable } from '@nestjs/common';
import { GuardDutty } from '../schemas/guard_duttys.schema';
import {
  convertTimeStampToStartDay,
  getDayMonthAndYear,
  getMidnightDate,
  getNumDaysOfMonth,
  getStartOfMonthTimestamp,
  getWeekday,
} from 'src/utils/time.helper';
import { MAX_ITEM_QUERYS } from 'src/const';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { UnitDBService } from './unitDBService';

@Injectable()
export class GuardDuttyDBService extends BaseDBService<GuardDutty> {
  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  constructor(@InjectModel(GuardDutty.name) private readonly entityModel) {
    super(entityModel);
  }

  async getItems(query: QueryParams): Promise<ResponseQuery<GuardDutty>> {
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
          from: 'guardduttypositions',
          let: {
            guard_dutty_position: '$guard_dutty_position',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$guard_dutty_position'],
                },
              },
            },
          ],
          as: 'positions',
        },
      },
      {
        $set: {
          position: {
            $arrayElemAt: ['$positions', 0],
          },
        },
      },
      {
        $unset: 'positions',
      },
      {
        $lookup: {
          from: 'users',
          let: {
            user: '$user',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$user'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                full_name: 1,
                type: 1,
                rank: 1,
              },
            },
          ],
          as: 'users',
        },
      },
      {
        $set: {
          user_assign: {
            $arrayElemAt: ['$users', 0],
          },
        },
      },
      {
        $unset: 'users',
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
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
          as: 'units',
        },
      },
      {
        $set: {
          unit_assign: {
            $arrayElemAt: ['$units', 0],
          },
        },
      },
      {
        $unset: 'units',
      },
      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const ans = await this.entityModel.aggregate(queryDb).exec();
    const res_total = await this.entityModel.aggregate([
      {
        $match: filter,
      },
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

  async getListPendingGuardDuttyMonth(unitId: string, time: number) {
    const exactTime = getStartOfMonthTimestamp(time);
    const timeObject = getDayMonthAndYear(new Date(exactTime));
    const numDays = getNumDaysOfMonth(timeObject.month, timeObject.year);

    let curWeek = 1;
    let curDataWeek = {
      title: `Tuần ${curWeek} tháng ${timeObject.month}`,
      days: [],
    };

    const ans = [];

    for (let day = 1; day <= numDays; day++) {
      const weekDay = getWeekday(day, timeObject.month, timeObject.year);
      if (weekDay === 1 && day !== 1) {
        ans.push(curDataWeek);
        curWeek++;
        curDataWeek = {
          title: `Tuần ${curWeek} tháng ${timeObject.month}`,
          days: [],
        };
      }

      const newTime = getMidnightDate(day, timeObject.month, timeObject.year);
      const timeDay = convertTimeStampToStartDay(newTime.getTime());
      const data = await this.getItems({
        skip: 0,
        limit: MAX_ITEM_QUERYS,
        filter: {
          unit: unitId,
          time: timeDay,
        },
        sort: {
          'position.priority_display': -1,
          'position.last_update': -1,
        },
      });
      const { items, total } = data;

      const count = await this.countByFilter({
        unit: unitId,
        time: timeDay,
        is_complete: false,
      });
      const countAssign = await this.countByFilter({
        unit: unitId,
        time: timeDay,
        user: null,
      });

      curDataWeek.days.push({
        dayOfWeek: weekDay,
        title: `${day}/${timeObject.month}/${timeObject.year}`,
        items,
        total,
        isComplete: count > 0 ? false : true,
        isCompleteAssign: countAssign > 0 ? false : true,
      });
      // ans.push({
      //   title: `${day}/${timeObject.month}/${timeObject.year}`,
      //   items,
      //   total,
      // });
    }

    if (curDataWeek && curDataWeek.days.length) ans.push(curDataWeek);

    return ans;
  }

  async getListPendingGuardDuttyMonthByDay(unitId: string, time: number) {
    const exactTime = getStartOfMonthTimestamp(time);
    const timeObject = getDayMonthAndYear(new Date(exactTime));
    const numDays = getNumDaysOfMonth(timeObject.month, timeObject.year);
    const ans = [];

    for (let day = 1; day <= numDays; day++) {
      const newTime = getMidnightDate(day, timeObject.month, timeObject.year);
      const timeDay = convertTimeStampToStartDay(newTime.getTime());
      const data = await this.getItems({
        skip: 0,
        limit: MAX_ITEM_QUERYS,
        filter: {
          unit: unitId,
          time: timeDay,
        },
        sort: {
          'position.priority_display': -1,
          'position.last_update': -1,
        },
      });
      const { items, total } = data;

      ans.push({
        title: `${day}/${timeObject.month}/${timeObject.year}`,
        items,
        total,
      });
    }

    return ans;
  }

  async getListGuardDuttyCompleteByUnit(unitId: string, time: number) {
    const exactTime = getStartOfMonthTimestamp(time);
    const timeObject = getDayMonthAndYear(new Date(exactTime));
    const numDays = getNumDaysOfMonth(timeObject.month, timeObject.year);

    const unitChilds = await this.unitDBService.getListChild(unitId);
    const unitChildIds = unitChilds.map((i) => i._id.toString());
    unitChildIds.push(unitId);

    let curWeek = 1;
    let curDataWeek = {
      title: `Tuần ${curWeek} tháng ${timeObject.month}`,
      days: [],
    };

    const ans = [];

    for (let day = 1; day <= numDays; day++) {
      const weekDay = getWeekday(day, timeObject.month, timeObject.year);
      if (weekDay === 1 && day !== 1) {
        ans.push(curDataWeek);
        curWeek++;
        curDataWeek = {
          title: `Tuần ${curWeek} tháng ${timeObject.month}`,
          days: [],
        };
      }

      const newTime = getMidnightDate(day, timeObject.month, timeObject.year);
      const timeDay = convertTimeStampToStartDay(newTime.getTime());
      const data = await this.getItems({
        skip: 0,
        limit: MAX_ITEM_QUERYS,
        filter: {
          unit: {
            $in: unitChildIds,
          },
          time: timeDay,
          is_complete: true,
        },
        sort: {
          'position.priority_display': -1,
          'position.last_update': -1,
        },
      });
      const { items, total } = data;

      const count = await this.countByFilter({
        unit: {
          $in: unitChildIds,
        },
        time: timeDay,
        is_complete: false,
      });
      const countAssign = await this.countByFilter({
        unit: {
          $in: unitChildIds,
        },
        time: timeDay,
        user: null,
      });

      curDataWeek.days.push({
        dayOfWeek: weekDay,
        title: `${day}/${timeObject.month}/${timeObject.year}`,
        items,
        total,
        isComplete: count > 0 ? false : true,
        isCompleteAssign: countAssign > 0 ? false : true,
      });
    }

    if (curDataWeek && curDataWeek.days.length) ans.push(curDataWeek);

    return ans;
  }

  async getListGuardDuttyCompleteByPersonal(userId: string, time: number) {
    const exactTime = getStartOfMonthTimestamp(time);
    const timeObject = getDayMonthAndYear(new Date(exactTime));
    const numDays = getNumDaysOfMonth(timeObject.month, timeObject.year);

    let curWeek = 1;
    let curDataWeek = {
      title: `Tuần ${curWeek} tháng ${timeObject.month}`,
      days: [],
    };

    const ans = [];

    for (let day = 1; day <= numDays; day++) {
      const weekDay = getWeekday(day, timeObject.month, timeObject.year);
      if (weekDay === 1 && day !== 1) {
        ans.push(curDataWeek);
        curWeek++;
        curDataWeek = {
          title: `Tuần ${curWeek} tháng ${timeObject.month}`,
          days: [],
        };
      }

      const newTime = getMidnightDate(day, timeObject.month, timeObject.year);
      const timeDay = convertTimeStampToStartDay(newTime.getTime());
      const data = await this.getItems({
        skip: 0,
        limit: MAX_ITEM_QUERYS,
        filter: {
          user: userId,
          time: timeDay,
          is_complete: true,
        },
        sort: {
          'position.priority_display': -1,
          'position.last_update': -1,
        },
      });
      const { items, total } = data;

      curDataWeek.days.push({
        dayOfWeek: weekDay,
        title: `${day}/${timeObject.month}/${timeObject.year}`,
        items,
        total,
      });
    }

    if (curDataWeek && curDataWeek.days.length) ans.push(curDataWeek);

    return ans;
  }
}
