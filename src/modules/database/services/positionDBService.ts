import { InjectModel } from '@nestjs/mongoose';
import { Position } from '../schemas/position.schema';
import { BaseDBService } from './base';
import { HttpException, Injectable } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from 'src/const';
import { QueryParams } from 'src/interface/i-base-db-service';
import { MAX_ITEM_QUERYS } from 'src/const';

@Injectable()
export class PositionDBService extends BaseDBService<Position> {
  constructor(@InjectModel(Position.name) private readonly entityModel) {
    super(entityModel);
  }

  async insertItem(entity: any): Promise<any> {
    const cnt = await this.countByFilter({ name: entity.name });
    if(cnt > 0)
        throw new HttpException(
            ResponseMessage.ALREAY_EXIST,
            ResponseCode.BAD_REQUEST,
        );
    return await super.insertItem(entity);
  }

}
