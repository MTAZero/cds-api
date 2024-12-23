import { Module } from '@nestjs/common';
import { MonthlyPlanController } from './monthly-plan.controller';
import { MonthlyPlanDetailController } from './monthly-plan-detail.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MonthlyPlanController, MonthlyPlanDetailController]
})
export class MonthlyPlanModule {}
