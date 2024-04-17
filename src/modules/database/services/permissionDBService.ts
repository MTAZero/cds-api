import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Permission } from '../schemas/permissions.schema';
import { QueryParams } from 'src/interface/i-base-db-service';
import { MAX_ITEM_QUERYS, ResponseMessage } from 'src/const';

@Injectable()
export class PermissionDBService extends BaseDBService<Permission> {
  constructor(@InjectModel(Permission.name) private readonly entityModel) {
    super(entityModel);
  }

  async getPermissionOfRoles(id: string): Promise<Array<Permission>> {
    const query: QueryParams = {
      skip: 0,
      limit: MAX_ITEM_QUERYS,
      filter: {
        role: id,
      },
    };
    const ans = await this.getItems(query);
    return ans.items;
  }

  async checkExist(entity: Permission): Promise<boolean> {
    const count = await this.countByFilter({
      module: entity.module,
      action: entity.action,
      role: entity.role.toString(),
    });

    return count > 0;
  }

  async insertItem(entity: any): Promise<any> {
    if (await this.checkExist(entity))
      throw new BadRequestException(ResponseMessage.ALREADY_EXIST);
    return super.insertItem(entity);
  }
}
