import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { GuardDutty } from '../schemas/guard-dutty.schema';

@Injectable()
export class GuardDuttyDBService extends BaseDBService<GuardDutty> {
  constructor(@InjectModel(GuardDutty.name) private readonly entityModel) {
    super(entityModel);
  }
}
