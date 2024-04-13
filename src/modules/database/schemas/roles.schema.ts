import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Role extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;

  @Prop()
  status: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({
  name: 'text',
  description: 'text',
});
