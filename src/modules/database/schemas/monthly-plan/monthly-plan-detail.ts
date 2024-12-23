import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from 'mongoose';
import { LoaiNoiDungHuanLuyenThang } from "src/enums";

@Schema()
export class MonthlyPlanDetail extends Document<any>{
    _id: Types.ObjectId;

    @Prop()
    last_update: number;

    @Prop()
    created_date: number;

    @Prop({ type: Types.ObjectId, ref: 'MonthlyPlan', default: null })
    ke_hoach_thang: ObjectId;

    @Prop()
    type: string;
    // A. sĩ quan chỉ huy, cơ quan/huấn luyện hàng tháng/học chính trị, pháp luật và nghị quyết...
    // A. sĩ quan chỉ huy, cơ quan/huấn luyện hàng tháng/huấn luyện quân sự chung

    @Prop() 
    tham_gia: string; // sỹ quan chỉ huy, cơ quan, qncn....

    @Prop()
    noi_dung: string; // nội dung

    @Prop({ type: String, enum: LoaiNoiDungHuanLuyenThang, default: LoaiNoiDungHuanLuyenThang.KHAC })
    loai_noi_dung: LoaiNoiDungHuanLuyenThang;

    @Prop()
    loai_doi_tuong: string; //

    @Prop()
    cap_phu_trach: string; // 

    @Prop()
    tong_gio: number;
    @Prop() 
    tuan_1: number;
    @Prop()
    tuan_2: number;
    @Prop()
    tuan_3: number;
    @Prop()
    tuan_4: number;
    @Prop()
    tuan_5: number;

    @Prop()
    bien_phap_tien_hanh: string;
}

export const MonthlyPlanDetailSchema = SchemaFactory.createForClass(MonthlyPlanDetail);

MonthlyPlanDetailSchema.index({
    type: 'text'
});
