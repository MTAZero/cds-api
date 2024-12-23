import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { HttpException, Injectable } from '@nestjs/common';
import { TypeBook } from '../schemas/typeBook.schema';
import { ResponseCode, ResponseMessage } from 'src/const';

@Injectable()
export class TypeBookDBService extends BaseDBService<TypeBook> {
  constructor(@InjectModel(TypeBook.name) private readonly entityModel) {
    super(entityModel);
  }

    async insertItem(entity: any): Promise<any> {
      const cnt = await this.countByFilter({ name: entity.type });
      if(cnt > 0)
          throw new HttpException(
              ResponseMessage.ALREADY_EXIST,
              ResponseCode.BAD_REQUEST,
          );
      return await super.insertItem(entity);
    }
}
