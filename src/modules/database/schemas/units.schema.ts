import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema()
export class Unit extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  parent: ObjectId;

  @Prop()
  key: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);

UnitSchema.index({
  name: 'text',
  description: 'text',
});
