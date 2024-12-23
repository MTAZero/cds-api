import { Module } from '@nestjs/common';
import { WorkCalendarController } from './work-calendar.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkCalendarController],
})
export class WorkCalendarModule {}
