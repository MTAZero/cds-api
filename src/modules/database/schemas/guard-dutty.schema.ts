import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class GuardDutty extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 1 })
  rate: number;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const GuardDuttySchema = SchemaFactory.createForClass(GuardDutty);

GuardDuttySchema.index({
  name: 'text',
  description: 'text',
});
