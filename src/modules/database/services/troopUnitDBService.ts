import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { TroopUnits } from '../schemas/troop-units.schema';
import { TroopUnitReportDto } from 'src/modules/troop-report/dtos/troop-unit-report';
import { User } from '../schemas/users.schema';
import { UserDBService } from './userDBService';
import { TroopStatus } from 'src/enums';
import { TroopDetailDBService } from './troopDetailDBService';
import { convertTimeStampToStartDay } from 'src/utils/time.helper';
import { TroopDetail } from '../schemas/troop-detail.schema';
import { ObjectId } from 'mongoose';

@Injectable()
export class TroopUnitDBService extends BaseDBService<TroopUnits> {
  @Inject(UserDBService)
  userDBService: UserDBService;

  @Inject(TroopDetailDBService)
  tropDetailDBService: TroopDetailDBService;

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
    if (user.unit.toString() !== data.unit.toString())
      throw new ForbiddenException();

    const time = convertTimeStampToStartDay(data.time);
    const item: TroopUnits = await this.insertOrUpdate({
      time,
      unit: data.unit,
      user_report: user._id,
    });

    const users = await this.userDBService.getUsersOfUnit(user.unit.toString());

    const promises: Promise<any>[] = [];
    for (let index = 0; index < users.length; index++) {
      let status: TroopStatus = TroopStatus.CoMat;

      const ind = data.absentTroops.findIndex(
        (i) => i.user.toString() === users[index]._id.toString(),
      );
      if (ind !== -1) status = data.absentTroops[ind].reason;

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
}
