import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema()
export class Position extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const PositionSchema = SchemaFactory.createForClass(Position);