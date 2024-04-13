import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Role } from './roles.schema';

@Schema()
export class Permission extends Document<any> {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Role.name, default: null })
  role: ObjectId;

  @Prop()
  module: string;

  @Prop()
  action: string;

  @Prop()
  last_update: number;

  @Prop()
  created_date: number;
}

export const PermisisonShema = SchemaFactory.createForClass(Permission);

PermisisonShema.index({
  name: 'text',
  description: 'text',
});
