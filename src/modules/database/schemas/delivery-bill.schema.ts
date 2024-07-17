import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { VehicleCommand } from './vehicleCommand.schema';

@Schema()
export class DeliveryBill extends Document<any> {
  _id: ObjectId;

  @Prop()
  deliveryUnit: string;

  @Prop()
  receiveUnit: string;

  @Prop()
  exportProperty: string;

  @Prop({ type: Types.ObjectId, ref: VehicleCommand.name, default: null })
  belongCommandID: string;

  @Prop()
  receiver: string;

  @Prop()
  referral: string;

  @Prop()
  numberBill: string;

  @Prop()
  date: Date;

  @Prop()
  expiryDate: Date;

  @Prop()
  shippingUnit: string;

  @Prop()
  license: string;

  @Prop()
  designCapacity: string;

  @Prop()
  exportCapacity: string;

  @Prop()
  numberOfPackages: string;

  @Prop()
  materials: [];

  @Prop()
  note: string;

  @Prop()
  deliverier: string;

  @Prop()
  financePerson: string;

  @Prop()
  createdPerson: string;

  @Prop()
  leader: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const DeliveryBillSchema = SchemaFactory.createForClass(DeliveryBill);

DeliveryBillSchema.index({
  deliveryUnit: 'text',
  receiver: 'text',
  date: 'text'
});
