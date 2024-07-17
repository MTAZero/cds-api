import { Module } from '@nestjs/common';
import { ManagerWorkAddressController } from './managerWorkAddress.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ManagerWorkAddressController],
})
export class ManagerWorkAddressModule {}
