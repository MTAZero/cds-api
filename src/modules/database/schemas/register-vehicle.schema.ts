import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';
import { Unit } from './units.schema';


@Schema()
export class RegisterVehicle extends Document<any> {
  _id: ObjectId;

  @Prop()
  driver: string;

  @Prop()
  rank: string;

  @Prop()
  license: string;

  @Prop()
  contentUse: string;

  @Prop()
  location: string;

  @Prop()
  fromDateTime: number;

  @Prop()
  toDateTime: number;

  @Prop()
  distance: string;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: ObjectId;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const RegisterVehicleSchema = SchemaFactory.createForClass(RegisterVehicle);

RegisterVehicleSchema.index({
  name: 'text',
  license: 'text',
  location: 'text'
});
