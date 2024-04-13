import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { Permission } from '../schemas/permissions.schema';

@Injectable()
export class PermissionDBService extends BaseDBService<Permission> {
  constructor(@InjectModel(Permission.name) private readonly entityModel) {
    super(entityModel);
  }
}
