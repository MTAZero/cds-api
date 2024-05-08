import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';
import { GuardDuttyPosition } from './guard-dutty-position.schema';

@Schema()
export class GuardDuttyGenerate extends Document<any> {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: GuardDuttyPosition.name, default: null })
  guard_dutty_position: ObjectId;

  @Prop({ default: 0 })
  time: number;

  @Prop()
  title: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const GuardDuttyGenerateSchema =
  SchemaFactory.createForClass(GuardDuttyGenerate);
