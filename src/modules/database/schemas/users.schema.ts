import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';
import { Role } from './roles.schema';
import { Position } from './position.schema';

@Schema()
export class User extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  full_name: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  isPersonal: boolean;

  @Prop()
  last_update: number;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: ObjectId;

  @Prop({ type: Types.ObjectId, ref: Role.name, default: null })
  role: ObjectId;

  @Prop()
  type: string;

  @Prop()
  rank: string;
  
  @Prop({ type: Types.ObjectId, ref: Position.name, default: null })
  position: ObjectId;

  @Prop()
  created_date: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  username: 'text',
  full_name: 'text',
  type: 'text',
});
