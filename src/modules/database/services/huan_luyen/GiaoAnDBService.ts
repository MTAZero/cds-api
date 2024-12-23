import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from '../base';
import { Injectable } from '@nestjs/common';
import { GiaoAn } from '../../schemas/huan_luyen/giao_an.schema';

@Injectable()
export class GiaoAnDBService extends BaseDBService<GiaoAn> {
  constructor(@InjectModel(GiaoAn.name) private readonly entityModel) {
    super(entityModel);
  }
}