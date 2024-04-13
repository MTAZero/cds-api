import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { Role } from '../schemas/roles.schema';

@Injectable()
export class RoleDBService extends BaseDBService<Role> {
  constructor(@InjectModel(Role.name) private readonly entityModel) {
    super(entityModel);
  }
}
