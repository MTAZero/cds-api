import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { User } from './users.schema';
import { GuardDutty } from './guard-dutty.schema';

@Schema()
export class DuttySetting extends Document<any> {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: ObjectId;

  @Prop({ type: Types.ObjectId, ref: GuardDutty.name, default: null })
  guard_dutty: ObjectId;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const DuttySettingSchema = SchemaFactory.createForClass(DuttySetting);

DuttySettingSchema.index({
  name: 'text',
  description: 'text',
});
