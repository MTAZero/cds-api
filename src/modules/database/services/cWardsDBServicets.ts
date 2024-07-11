import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { cWards } from '../schemas/c_wards';

@Injectable()
export class WardsDBService extends BaseDBService<cWards> {
  constructor(@InjectModel(cWards.name) private readonly entityModel) {
    super(entityModel);
  }
}
