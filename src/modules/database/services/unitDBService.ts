import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { Unit } from '../schemas/units.schema';

@Injectable()
export class UnitDBService extends BaseDBService<Unit> {
  constructor(@InjectModel(Unit.name) private readonly entityModel) {
    super(entityModel);
  }

  async insertItem(entity: any): Promise<any> {
    const item = await super.insertItem(entity);

    if (item.parent) {
      const parent = await this.getItemById(item.parent);
      item.key = parent.key + '_' + item._id;
    } else item.key = item._id;

    return await super.updateItem(item._id, item);
  }

  async removeItem(id: any): Promise<boolean> {
    const item = await this.getItemById(id);

    const ans = await this.removeMany({
      key: { $regex: item._id, $options: 'i' },
    });
    return ans;
  }
}
