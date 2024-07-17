import { Module } from '@nestjs/common';
import { ManagerTaskController } from './managerTask.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ManagerTaskController],
})
export class ManagerTaskModule {}
