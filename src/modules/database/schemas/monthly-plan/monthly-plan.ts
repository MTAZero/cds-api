import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from 'mongoose';
import { Unit } from "../units.schema";

@Schema()
export class MonthlyPlan extends Document<any>{
    _id: Types.ObjectId;

    @Prop()
    last_update: number;

    @Prop()
    created_date: number;

    @Prop({ type: Types.ObjectId, ref: 'Unit', default: null })
    unit: ObjectId;

    @Prop()
    name: string;

    @Prop()
    ts: number;
}

export const MonthlyPlanSchema = SchemaFactory.createForClass(MonthlyPlan);
