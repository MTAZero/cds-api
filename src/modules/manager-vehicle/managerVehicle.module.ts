import { Module } from '@nestjs/common';
import { ManagerVehicleController } from './managerVehicle.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ManagerVehicleController],
})
export class ManagerVehicleModule {}
