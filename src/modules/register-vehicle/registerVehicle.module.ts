import { Module } from '@nestjs/common';
import { RegisterVehicleController } from './registerVehicle.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RegisterVehicleController],
})
export class RegisterVehicleModule {}
