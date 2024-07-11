import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from 'mongoose';

@Schema() 
export class cDistricts extends Document<any>{
    _id: Types.ObjectId;

    @Prop()
    last_update: number;

    @Prop()
    created_date: number;

    @Prop()
    name: string;

    @Prop() 
    type: string;

    @Prop()
    slug: string;

    @Prop()
    name_with_type: string;

    @Prop()
    path: string;

    @Prop() 
    path_with_type: string;

    @Prop()
    code: string;

    @Prop()
    parent_code: string;

    @Prop()
    status: string;
}

export const cDistricts_schema = SchemaFactory.createForClass(cDistricts);

cDistricts_schema.index({
    name: 'text',
    name_with_type: 'text',
    path: 'text',
    path_with_type: 'text'
});
