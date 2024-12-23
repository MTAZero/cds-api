import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Unit } from './units.schema';
import { User } from './users.schema';

@Schema()
export class IncomingCall extends Document<any> {

  _id: Types.ObjectId;

  @Prop({ default: null })
  dateRead: number;

  @Prop({ default: null })
  personRead: string;

  @Prop({ default: null })
  rankRead: string;

  @Prop({ default: null })
  positionRead: string;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unitId: string;
  
  @Prop({ default: null })
  telephoneNumber: string;

  @Prop({ default: null })
  content: string;

  @Prop({ default: null })
  sign: string;

  @Prop({ default: null })
  personReceived: string;

  @Prop({ default: null })
  positionReceived: string;

  @Prop({ default: null })
  personSecondReceived: string;

  @Prop({ default: null })
  dateReceived: number;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  idLeader: string;

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const IncomingCallSchema = SchemaFactory.createForClass(IncomingCall);
