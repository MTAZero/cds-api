import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Unit } from './units.schema';

@Schema()
export class AccessControl extends Document<any> {

  _id: Types.ObjectId;

  @Prop({ default: null })
  date: number;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unitId: string;

  @Prop({ default: null })
  pickPersonName: string;

  @Prop({ default: [] })
  guestName: [];

  @Prop({ default: null })
  typeVehicle: string;

  @Prop({ default: null })
  license: string;

  @Prop({ default: null })
  identityNumber: string;

  @Prop({ default: null })
  issued: number;

  @Prop({ default: null })
  addressIssued: string;

  @Prop({ default: null })
  contentWork: string;

  @Prop({ default: null })
  fromDateTime: number;

  @Prop({ default: null })
  toDateTime: number;

  @Prop({ default: null })
  note: string;

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const AccessControlSchema = SchemaFactory.createForClass(AccessControl);
