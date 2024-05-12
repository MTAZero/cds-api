import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class WorkCalendar extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop()
  lead: string;

  @Prop()
  time_start: number;

  @Prop()
  time_end: number;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const WorkCalendarSchema = SchemaFactory.createForClass(WorkCalendar);

WorkCalendarSchema.index({
  name: 'text',
  description: 'text',
  localtion: 'text',
});
