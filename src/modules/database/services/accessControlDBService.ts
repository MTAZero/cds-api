import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnitDBService } from './unitDBService';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { AccessControl } from '../schemas/access-control.schema';

@Injectable()
export class AccessControlDBService extends BaseDBService<AccessControl> {
  
  @Inject(UnitDBService)
  unitDBService: UnitDBService;
  
  constructor(@InjectModel(AccessControl.name) private readonly entityModel) {
    super(entityModel);
  }

  async getAccessControlBelongUnit(
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    let lstAccessControl = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });

    const populateQuery = [
      {
          path: "unitId",
      }
  ];
  
    const lst = await this.entityModel.populate(lstAccessControl.items, populateQuery);

    const ans = lst.map(
      (item) => {
        return {
          ...item,
          ...{
            unitId: item.unitId._id,
            unitName: item.unitId.name
          }
        }
      }
    )

    return ans;
  }

  async insert(entity: any): Promise<AccessControl> {
    
    const accessControl =  await this.insertItem(entity);
    return accessControl;

  }

  async update(accessControlId: string ,entity: any): Promise<AccessControl> {

    const accessControl = await this.getItemById(accessControlId);
    if(!accessControl) throw new NotFoundException();

    return await this.updateItem(accessControlId, entity);
  }

  async remove(accessControlId: string): Promise<any> {
    const accessControl = await this.getItemById(accessControlId);
    if(!accessControl) throw new NotFoundException();

    return await this.removeItem(accessControlId);
  }

  async getDetail(accessControlId: string): Promise<any> {

    const accessControl = await this.getItemById(accessControlId)
    if(!accessControl) throw new NotFoundException();

    const ans = {
      ...accessControl,
      unitName: (await this.unitDBService.getItemById(accessControl.unitId)).name,
    };

    return ans;
  }
}
