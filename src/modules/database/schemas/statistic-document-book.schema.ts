import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Unit } from './units.schema';
import { User } from './users.schema';

@Schema()
export class StatisticDocumentBook extends Document<any> {

  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unitId: string;

  @Prop()
  documentName: string;

  @Prop()
  dvt: string;

  @Prop()
  sum: number;

  @Prop()
  publishYear: string;

  @Prop()
  numberRegister: string;

  @Prop()
  receivedDate: number;

  @Prop()
  receiver: string;

  @Prop()
  paidDate: number;

  @Prop()
  payer: string;

  @Prop()
  sumRemain: number;

  @Prop()
  note: string;

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const StatisticDocumentBookSchema = SchemaFactory.createForClass(StatisticDocumentBook);
