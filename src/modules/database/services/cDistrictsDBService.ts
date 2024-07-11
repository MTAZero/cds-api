import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { cDistricts } from '../schemas/c_districts';

@Injectable()
export class DistrictDBService extends BaseDBService<cDistricts> {
  constructor(@InjectModel(cDistricts.name) private readonly entityModel) {
    super(entityModel);
  }
}
