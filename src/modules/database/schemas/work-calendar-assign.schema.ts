import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';
import { Position } from './position.schema';
import { WorkCalendar } from './work-calendar.schema';
import { User } from './users.schema';

@Schema()
export class WorkCalendarAssign extends Document<any> {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: WorkCalendar.name, default: null })
  work_calendar: ObjectId;

  @Prop({ default: true })
  isUnit: boolean;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: ObjectId;

  @Prop()
  created_date: number;

  @Prop()
  last_update: number;
}

export const WorkCalendarAssignSchema =
  SchemaFactory.createForClass(WorkCalendarAssign);

WorkCalendarAssignSchema.index({
  username: 'text',
  full_name: 'text',
  type: 'text',
});
