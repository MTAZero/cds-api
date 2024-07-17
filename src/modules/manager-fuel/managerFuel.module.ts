import { Module } from '@nestjs/common';
import { ManagerFuelController } from './managerFuel.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ManagerFuelController],
})
export class ManagerFuelModule {}
