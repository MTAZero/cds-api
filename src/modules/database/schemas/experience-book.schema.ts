import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';

@Schema()
export class ExperienceBook extends Document<any> {

  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: string

  @Prop()
  year: Number;

  @Prop()
  month: Number;

  @Prop()
  week: Number;

  @Prop()
  date: Date;

  @Prop()
  time: string;

  @Prop()
  join: string;

  @Prop()
  resultTraining: string;

  @Prop()
  evaluation: string;

  @Prop()
  dutyNextweek: string;

  @Prop()
  sign: string

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const ExperienceBookSchema = SchemaFactory.createForClass(ExperienceBook);
