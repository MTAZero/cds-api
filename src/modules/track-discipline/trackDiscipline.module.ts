import { Module } from '@nestjs/common';
import { ManagerTrackDisciplineController } from './trackDiscipline.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ManagerTrackDisciplineController],
})
export class ManagerTrackDisciplineModule {}
