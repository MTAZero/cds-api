import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';
import { GuardDuttyPosition } from './guard-dutty-position.schema';
import { User } from './users.schema';
import { GuardDuttyGenerate } from './guard_dutty_generate.schema';

@Schema()
export class GuardDutty extends Document<any> {
  _id: Types.ObjectId;

  @Prop({ default: 0 })
  time: number;

  // @Prop({ type: Types.ObjectId, ref: GuardDuttyGenerate.name, default: null })
  // guard_dutty_generate: ObjectId;

  @Prop({ type: Types.ObjectId, ref: GuardDuttyPosition.name, default: null })
  guard_dutty_position: ObjectId;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: ObjectId;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit_default: ObjectId;

  @Prop()
  note: string;

  @Prop({ default: false })
  is_complete: boolean;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const GuardDuttySchema = SchemaFactory.createForClass(GuardDutty);
