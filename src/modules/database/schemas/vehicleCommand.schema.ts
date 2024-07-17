import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';
import { Unit } from './units.schema';


@Schema()
export class VehicleCommand extends Document<any> {
  _id: ObjectId;

  @Prop()
  typeVehicle: string;

  @Prop()
  label: string;

  @Prop()
  license: string;

  @Prop()
  vehicleBelongUnit: string;

  @Prop()
  unitWork: string;

  @Prop()
  contentUse: string;

  @Prop()
  fromLocation: string;

  @Prop()
  toLocation: string;

  @Prop()
  distance: string;

  @Prop()
  date: Date;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const VehicleCommandSchema = SchemaFactory.createForClass(VehicleCommand);

VehicleCommandSchema.index({
  name: 'text',
  license: 'text',
  fromLocation: 'text',
  toLocation: 'text',
  date: 'text'
});
