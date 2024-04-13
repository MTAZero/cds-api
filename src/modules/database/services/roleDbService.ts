import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { Role } from '../schemas/roles.schema';

@Injectable()
export class RoleDBService extends BaseDBService<Role> {
  constructor(@InjectModel(Role.name) private readonly roleModel) {
    super(roleModel);
  }

  async updateItem(id: any, entity: Partial<Role>): Promise<Role | null> {
    entity.last_update = new Date().getTime();
    return super.updateItem(id, entity);
  }

  async insertItem(entity: Partial<Role>): Promise<any> {
    entity.created_date = new Date().getTime();
    entity.last_update = new Date().getTime();
    return super.insertItem(entity);
  }

  async updateMany(query: object = {}, entity: any) {
    entity.last_update = new Date().getTime();
    return super.updateMany(query, entity);
  }
}
