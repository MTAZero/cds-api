import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';
import { Progress } from './progress.schema';

@Schema()
export class Training extends Document<any> {

 // @Prop({ type: Types.ObjectId, ref: Progress.name, default: null })
  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: Progress.name, default: null })
  progress: string
  
  @Prop({default: []})
  element_join: []

  @Prop({default: 0})
  time_train_actual: Number

  @Prop()
  week: Number

  @Prop()
  month: Number

  @Prop()
  year: Number

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: ObjectId;

  @Prop({default: 0})
  sum_people: Number 

  @Prop({default: 0})
  sum_joiner: Number

  @Prop({default: null})
  evaluation: string

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const TrainingSchema = SchemaFactory.createForClass(Training);
