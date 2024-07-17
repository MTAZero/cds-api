import { Module } from '@nestjs/common';
import { ManagerTrackWorkController } from './trackWork.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ManagerTrackWorkController],
})
export class ManagerTrackWorkModule {}
