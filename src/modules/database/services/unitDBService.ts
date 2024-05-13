import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Unit } from '../schemas/units.schema';
import { QueryParams } from 'src/interface/i-base-db-service';
import { MAX_ITEM_QUERYS } from 'src/const';

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

  async getListChild(id: string): Promise<Array<Unit>> {
    const query: QueryParams = {
      skip: 0,
      limit: MAX_ITEM_QUERYS,
      filter: {
        parent: id,
      },
    };
    const ans = await this.getItems(query);
    return ans.items;
  }

  async getListDescendants(id: string): Promise<any> {
    const ans = await this.getItemById(id);

    const query: QueryParams = {
      skip: 0,
      limit: MAX_ITEM_QUERYS,
      filter: {
        parent: id,
      },
    };
    const childs = (await this.getItems(query)).items;

    if (childs.length === 0)
      return {
        ...ans,
        ...{
          childs: [],
        },
      };

    const finalChilds = await Promise.all(
      childs.map(async (child) => {
        const childId = child._id.toString();
        const childList = await this.getListDescendants(childId);
        return childList;
      }),
    );

    return {
      ...ans,
      ...{
        childs: finalChilds,
      },
    };
  }

  async getAllDescendants(id: string): Promise<Array<Unit>> {
    const unit = await this.getItemById(id);

    const query: QueryParams = {
      skip: 0,
      limit: MAX_ITEM_QUERYS,
      filter: {
        key: { $regex: unit._id.toString(), $options: 'i' },
      },
    };
    const childs = (await this.getItems(query)).items;

    return childs;
  }

  async checkUnitIsDescenants(
    unitId: string,
    unitChildId: string,
    acceptEqual: boolean = true,
  ): Promise<boolean> {
    const unit: Unit = await this.getItemById(unitId);
    const entity: Unit = await this.getItemById(unitChildId);

    if (!unit || !entity) return false;
    if (unitId === unitChildId) return acceptEqual;
    if (entity.key.toString().includes(unit._id.toString())) return true;

    return false;
  }

  async getRootOfUnit(unitId: string) {
    const unit: Unit = await this.getItemById(unitId);
    if (!unit) throw new NotFoundException();

    if (!unit.parent) return unit;
    return this.getRootOfUnit(unit.parent.toString());
  }

  async checkUnitPermission(
    unitId: string,
    unitChildId: string,
  ): Promise<boolean> {
    const unit: Unit = await this.getItemById(unitId);
    const entity: Unit = await this.getItemById(unitChildId);

    if (!unit || !entity) return false;
    if (unitId === unitChildId) return true;
    if (entity.key.toString().includes(unit._id.toString())) return true;

    return false;
  }
}
