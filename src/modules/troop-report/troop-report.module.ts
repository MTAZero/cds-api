import { Module } from '@nestjs/common';
import { TroopReportController } from './troop-report.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TroopReportController],
})
export class TroopReportModule {}
