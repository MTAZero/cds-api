import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Unit } from './units.schema';
import { User } from './users.schema';

@Schema()
export class TrackWorkBook extends Document<any> {

  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unitId: string;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  personId: string;

  @Prop()
  rank: string;

  @Prop()
  unit: string;

  @Prop()
  fromDate: number;

  @Prop()
  toDate: number;

  @Prop()
  content: string;

  @Prop()
  result: string;

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const TrackWorkBookSchema = SchemaFactory.createForClass(TrackWorkBook);
