import { Module } from '@nestjs/common';
import { VehicleCommandController } from './vehicleCommand.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VehicleCommandController],
})
export class VehicleCommandModule {}
