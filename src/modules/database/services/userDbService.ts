import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/users.schema';
import { BaseDBService } from './base';
import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT, ResponseCode, ResponseMessage } from 'src/const';

@Injectable()
export class UserDBService extends BaseDBService<User> {
  constructor(@InjectModel(User.name) private readonly entityModel) {
    super(entityModel);
  }

  async insertItem(entity: any): Promise<any> {
    const cnt = await this.countByFilter({ username: entity.username });
    if (cnt > 0)
      throw new HttpException(
        ResponseMessage.ALREAY_EXIST,
        ResponseCode.BAD_REQUEST,
      );

    entity.password = await bcrypt.hash(entity.password, BCRYPT_SALT);
    return super.insertItem(entity);
  }
}
