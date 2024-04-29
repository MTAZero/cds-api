import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { User } from './users.schema';
import { Unit } from './units.schema';

@Schema()
export class LeaveRegister extends Document<any> {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: ObjectId;

  @Prop()
  start_time: number;

  @Prop()
  end_time: number;

  @Prop()
  location: string;

  @Prop()
  reason: string;

  @Prop()
  contact: string;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user_approve: ObjectId;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit_approve: ObjectId;

  @Prop()
  time_approve: number;

  @Prop()
  time_register: number;

  @Prop()
  status: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const LeaveRegisterSchema = SchemaFactory.createForClass(LeaveRegister);

LeaveRegisterSchema.index({
  location: 'text',
  contact: 'text',
  reason: 'text',
});
