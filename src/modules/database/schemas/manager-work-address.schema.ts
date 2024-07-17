import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ManagerWorkAddress extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  unitName: string;

  @Prop()
  address: string;

  @Prop()
  distance: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const ManagerWorkAddressSchema = SchemaFactory.createForClass(ManagerWorkAddress);

ManagerWorkAddressSchema.index({
  unitName: 'text',
  address: 'text',
});
