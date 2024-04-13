import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
  last_update: number;

  @Prop()
  created_date: number;

  @Prop()
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserNameSchema: string = 'tbl_users';

UserSchema.index({
  username: 'text',
  email: 'text',
  address: 'text',
  full_name: 'text',
  role: 'text',
});
