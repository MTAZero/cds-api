import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';
import { User } from './users.schema';

@Schema()
export class TroopUnits extends Document<any> {
  _id: ObjectId;

  @Prop()
  time: number;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user_report: ObjectId;

  @Prop()
  created_date: number;

  @Prop()
  last_update: number;
}

export const TroopUnitSchema = SchemaFactory.createForClass(TroopUnits);
