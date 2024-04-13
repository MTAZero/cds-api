import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { Permission } from '../schemas/permissions.schema';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';

@Injectable()
export class PermissionDBService extends BaseDBService<Permission> {
  constructor(@InjectModel(Permission.name) private readonly entityModel) {
    super(entityModel);
  }

  async getPermissionOfRoles(id: string): Promise<Array<Permission>> {
    const query: QueryParams = {
      skip: 0,
      limit: 1000,
      filter: {
        role: id,
      },
    };
    const ans = await this.getItems(query);
    return ans.items;
  }
}
