import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from '../base';
import { Injectable } from '@nestjs/common';
import { KeHoachThongQuaGiaoAn } from '../../schemas/huan_luyen/ke_hoach_thong_qua_giao_an.schema';

@Injectable()
export class KeHoachThongQuaGiaoAnDBService extends BaseDBService<KeHoachThongQuaGiaoAn> {
  constructor(
    @InjectModel(KeHoachThongQuaGiaoAn.name) private readonly entityModel,
  ) {
    super(entityModel);
  }
}
