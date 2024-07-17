import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from './units.schema';
import { User } from './users.schema';

@Schema()
export class MeetingBook extends Document<any> {

  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: string;

  @Prop()
  date: number;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  dutyLeader: string;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  dutySecondPerson: string;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  dutyThirdPerson: string;

  @Prop()
  weaponsEquipment: string;

  @Prop()
  advantages: string;

  @Prop()
  disadvantages: string;

  @Prop()
  scheduleUnitNextDay: string;

  @Prop()
  concludeDutyLeader: string;

  @Prop()
  request: string;

  @Prop()
  opinion: string;

  @Prop()
  scheduleSuperiorUnitNextDay: string;

  @Prop()
  opinionSuperiorUnitNextDay: string;

  @Prop()
  type: string;

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const MeetingBookSchema = SchemaFactory.createForClass(MeetingBook);
