import { InjectModel } from '@nestjs/mongoose';
import { Progress } from '../schemas/progress.schema';
import { BaseDBService } from './base';
import { ForbiddenException, HttpException, Inject, Injectable } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from 'src/const';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { MAX_ITEM_QUERYS } from 'src/const';
import { UnitDBService } from './unitDBService';
import { User } from '../schemas/users.schema';

@Injectable()
export class ProgressDBService extends BaseDBService<Progress> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;
  
  constructor(@InjectModel(Progress.name) private readonly entityModel) {
    super(entityModel);
  }

  async getProgressOfWeekBelongUnit(
    unitID: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    const unitsChild = await this.unitDBService.getAllDescendants(unitID)
    
    const checkPermisison = unitsChild.map( unit => {
      return unit._id.toString();
    }).includes(unitID.toString());

    if(!checkPermisison) throw new ForbiddenException();

    const ans = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });
    return ans;
  }

  async getDetailByID(unitID: string ,id: any): Promise<any> {
    const unitsChild = await this.unitDBService.getAllDescendants(unitID)
    
    const checkPermisison = unitsChild.map( unit => {
      return unit._id.toString();
    }).includes(unitID.toString());

    if(!checkPermisison) throw new ForbiddenException();

    const ans = await this.getItemById(id);
    return ans;
  }
  
}
