import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';
import { ManagerVehicle } from './manager-vehicle.schema';

@Schema()
export class VehicleCommand extends Document<any> {
  _id: ObjectId;

  @Prop()
  orderNumber: string;

  @Prop()
  commandDateCreated: number;

  @Prop()
  baseFromDate: number;

  @Prop()
  baseToDate: number;

  @Prop({ type: Types.ObjectId, ref: ManagerVehicle.name, default: null })
  vehicle: ObjectId;

  @Prop()
  mission: string;

  @Prop()
  unitWorkGo: string;

  @Prop()
  quantityGo: string;

  @Prop()
  fromLocationGo: string;

  @Prop()
  toLocationGo: string;

  @Prop()
  distanceGo: string;

  @Prop()
  numberTripGo: string;

  @Prop()
  unitWorkBack: string;

  @Prop()
  quantityBack: string;

  @Prop()
  fromLocationBack: string;

  @Prop()
  toLocationBack: string;

  @Prop()
  distanceBack: string;

  @Prop()
  numberTripBack: string;

  @Prop()
  extra: string;

  @Prop()
  performDateTime: number;

  @Prop()
  state: string 

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const VehicleCommandSchema = SchemaFactory.createForClass(VehicleCommand);

VehicleCommandSchema.index({
  fromLocation: 'text',
  toLocation: 'text',
  date: 'text'
});
