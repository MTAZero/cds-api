import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Unit } from './units.schema';
import { User } from './users.schema';

@Schema()
export class GoingCall extends Document<any> {

  _id: Types.ObjectId;

  @Prop({ default: null })
  dateTransfer: number;

  @Prop({ default: null })
  personTransfer: string;

  @Prop({ default: null })
  rankTransfer: string;

  @Prop({ default: null })
  positionTransfer: string;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unitIdTransfer: string;
  
  @Prop({ default: null })
  telephoneNumberTransfer: string;

  @Prop({ default: null })
  content: string;

  @Prop({ default: null })
  personReceived: string;

  @Prop({ default: null })
  positionReceived: string;

  @Prop({ default: null })
  rankReceived: string;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unitIdReceived: string;

  @Prop({ default: null })
  dateReceived: number;

  @Prop({ default: null })
  telephoneNumberReceived: string;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  idLeader: string;

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const GoingCallSchema = SchemaFactory.createForClass(GoingCall);
