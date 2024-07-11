import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from 'mongoose';

@Schema() 
export class cProvinces extends Document<any>{
    _id: Types.ObjectId;

    @Prop()
    last_update: number;

    @Prop()
    created_date: number;

    @Prop()
    name: string;

    @Prop()
    slug: string;

    @Prop()
    type: string;

    @Prop()
    name_with_type: String;

    @Prop()
    code: String;

    @Prop()
    status: string;
}

export const cProvinces_schema = SchemaFactory.createForClass(cProvinces);

cProvinces_schema.index({
    name: 'text',
    name_with_type: 'text'
});
