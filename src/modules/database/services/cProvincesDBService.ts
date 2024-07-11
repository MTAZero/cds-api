import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { cProvinces } from '../schemas/c_provinces';

@Injectable()
export class ProvincesDBService extends BaseDBService<cProvinces> {
  constructor(@InjectModel(cProvinces.name) private readonly entityModel) {
    super(entityModel);
  }
}
