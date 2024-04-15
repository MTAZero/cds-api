import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { TroopDetail } from '../schemas/troop-detail.schema';

@Injectable()
export class TroopDetailDBService extends BaseDBService<TroopDetail> {
  constructor(@InjectModel(TroopDetail.name) private readonly entityModel) {
    super(entityModel);
  }

  async insertOrUpdate(entity) {
    const res = await this.getFirstItem({
      time: entity.time,
      user: entity.user,
      report: entity.report,
    });

    if (!res) {
      const ans = await this.insertItem(entity);
      return ans;
    }

    const ans = await this.updateItem(res._id.toString(), {
      status: entity.status,
    });
    return ans;
  }
}
