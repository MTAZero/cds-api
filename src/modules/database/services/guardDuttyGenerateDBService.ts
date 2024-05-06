import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { GuardDuttyGenerate } from '../schemas/guard_dutty_generate.schema';

@Injectable()
export class GuardDuttyGenerateDBService extends BaseDBService<GuardDuttyGenerate> {
  constructor(
    @InjectModel(GuardDuttyGenerate.name) private readonly entityModel,
  ) {
    super(entityModel);
  }
}
