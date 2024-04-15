import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { User } from './users.schema';
import { TroopUnits } from './troop-units.schema';

@Schema()
export class TroopDetail extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  time: number;

  @Prop({ type: Types.ObjectId, ref: TroopUnits.name, default: null })
  report: ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: ObjectId;

  @Prop()
  status: string;

  @Prop()
  created_date: number;

  @Prop()
  last_update: number;
}

export const TroopDetailSchema = SchemaFactory.createForClass(TroopDetail);
