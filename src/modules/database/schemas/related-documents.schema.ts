import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { User } from './users.schema';
import { TypeBook } from './typeBook.schema';
import { Unit } from './units.schema';

@Schema()
export class RelatedDocument extends Document<any> {

  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  user: string;

  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: TypeBook.name, default: null })
  type: string;

  @Prop({ type: Types.ObjectId, ref: Unit.name, default: null })
  unit: string;   

  @Prop()
  url: string;

  @Prop()
  last_update: Number;

  @Prop()
  created_date: number;
}

export const RelatedDocumentSchema = SchemaFactory.createForClass(RelatedDocument);
