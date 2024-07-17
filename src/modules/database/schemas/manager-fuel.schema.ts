import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ManagerFuel extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  fuelName: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const ManagerFuelSchema = SchemaFactory.createForClass(ManagerFuel);

ManagerFuelSchema.index({
  fuelName: 'text',
});
