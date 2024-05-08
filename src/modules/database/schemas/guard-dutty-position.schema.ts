import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';

@Schema()
export class GuardDuttyPosition extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: ObjectId;

  @Prop({ default: 1 })
  number: number;

  @Prop()
  note: string;

  @Prop({ default: false })
  is_generate: boolean;

  @Prop({ default: 1 })
  rate: number;

  @Prop({ default: 0 })
  priority_display: number;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const GuardDuttyPositionSchema =
  SchemaFactory.createForClass(GuardDuttyPosition);

GuardDuttyPositionSchema.index({
  name: 'text',
  description: 'text',
  note: 'text',
});
