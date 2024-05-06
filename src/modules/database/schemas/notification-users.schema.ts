import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { User } from './users.schema';

@Schema()
export class NotificationUser extends Document<any> {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: ObjectId;

  @Prop()
  content: string;

  @Prop()
  status: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const NotificationUserSchema = SchemaFactory.createForClass(NotificationUser);

NotificationUserSchema.index({
  content: 'text',
});
