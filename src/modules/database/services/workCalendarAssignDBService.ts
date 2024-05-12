import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { WorkCalendarAssign } from '../schemas/work-calendar-assign.schema';

@Injectable()
export class WorkCalendarAssignDBService extends BaseDBService<WorkCalendarAssign> {
  constructor(
    @InjectModel(WorkCalendarAssign.name) private readonly entityModel,
  ) {
    super(entityModel);
  }
}
