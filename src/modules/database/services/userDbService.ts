import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/users.schema';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT } from 'src/const';

@Injectable()
export class UserDBService extends BaseDBService<User> {
  constructor(@InjectModel(User.name) private readonly userModel) {
    super(userModel);
  }

  async updateItem(id: any, entity: Partial<User>): Promise<User | null> {
    entity.last_update = new Date().getTime();
    return super.updateItem(id, entity);
  }

  async insertItem(entity: Partial<User>): Promise<any> {
    entity.created_date = new Date().getTime();
    entity.last_update = new Date().getTime();
    entity.password = await bcrypt.hash(entity.password, BCRYPT_SALT);
    return super.insertItem(entity);
  }

  async updateMany(query: object = {}, entity: any) {
    entity.last_update = new Date().getTime();
    return super.updateMany(query, entity);
  }
}
