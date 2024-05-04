import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { User } from './users.schema';
import { Training } from './trainnings.schema';

@Schema()
export class PersonalDiary extends Document<any> {

  _id: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: string

  @Prop({ type: Types.ObjectId, ref: Training.name, default: null })
  training: string;

  @Prop()
  type: string

  @Prop()
  note: string

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const PersonalDiarySchema = SchemaFactory.createForClass(PersonalDiary);
