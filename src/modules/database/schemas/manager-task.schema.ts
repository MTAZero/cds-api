import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ManagerTask extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  taskName: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const ManagerTaskSchema = SchemaFactory.createForClass(ManagerTask);

ManagerTaskSchema.index({
  taskName: 'text'
});
