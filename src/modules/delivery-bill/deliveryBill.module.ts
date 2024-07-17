import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DeliveryBillController } from './deliveryBill.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [DeliveryBillController],
})
export class DeliveryBillModule {}
