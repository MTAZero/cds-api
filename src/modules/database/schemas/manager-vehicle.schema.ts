import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ManagerVehicle extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  license: string;

  @Prop()
  norm: string;

  @Prop()
  typeVehicle: string;

  @Prop()
  driver: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const ManagerVehicleSchema = SchemaFactory.createForClass(ManagerVehicle);

ManagerVehicleSchema.index({
  name: 'text',
  license: 'text',
  driver: "text"
});
