import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class TypeBook extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  description: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const TypeBookSchema = SchemaFactory.createForClass(TypeBook);

TypeBookSchema.index({
  name: 'text',
  description: 'text',
});
