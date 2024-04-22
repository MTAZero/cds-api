import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';

@Schema()
export class Progress extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  date: Date

  @Prop()
  day_of_week: string;

  @Prop()
  week: Number

  @Prop()
  month: Number

  @Prop()
  year: Number

  @Prop()
  content: string

  @Prop()
  sum_time_train: Number

  @Prop()
  time_train_detail: []

  @Prop()
  unit_charge: string

  @Prop()
  location: string

  @Prop()
  guaranteed_material: string

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: ObjectId;

  @Prop()
  from_date: Date

  @Prop()
  to_date: Date

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
