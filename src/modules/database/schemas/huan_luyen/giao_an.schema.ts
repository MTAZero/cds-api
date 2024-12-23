import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users.schema';
import { Unit } from '../units.schema';

// Enum cho trạng thái
export enum TrangThaiEnum {
  DANG_XAY_DUNG = 'Đang xây dựng',
  DA_XAY_DUNG = 'Đã xây dựng',
  DA_THONG_QUA = 'Đã thông qua',
  DA_PHE_DUYET = 'Đã phê duyệt',
}

@Schema()
export class GiaoAn extends Document<any> {
  _id: Types.ObjectId;

  @Prop()
  ten: string;

  @Prop() // Dạng datetime
  created_date: number;

  @Prop() // Dạng datetime
  last_update: number;

  @Prop({ type: Types.ObjectId, ref: User.name }) // Liên kết bảng users
  nguoi_xay_dung: Types.ObjectId;

  @Prop()
  nganh: string;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_bat_dau_thong_qua: Date;

  @Prop()
  dia_diem_thong_qua: string;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_ket_thuc_thong_qua: Date;

  @Prop()
  dia_diem_phe_duyet: string;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_bat_dau_phe_duyet: Date;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_ket_thuc_phe_duyet: Date;

  @Prop()
  noi_dung_phe_duyet: string;

  @Prop()
  ket_luan_phe_duyet: string;

  @Prop()
  nguoi_phe_duyet: string;

  @Prop()
  muc_dich: string;

  @Prop()
  yeu_cau: string;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_hoan_thanh_cong_tac_chuan_bi: Date;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_len_lop_ly_thuyet: number;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_len_lop_thuc_hanh: number;

  @Prop()
  kiem_tra: number;

  @Prop()
  tong_thoi_gian_len_lop: number;

  @Prop({ enum: TrangThaiEnum }) // Định nghĩa enum trạng thái
  trang_thai: TrangThaiEnum;

  @Prop({ type: Types.ObjectId, ref: Unit.name }) // Liên kết bảng unit
  don_vi: Types.ObjectId;

  @Prop()
  file: string;
}

export const GiaoAnSchema = SchemaFactory.createForClass(GiaoAn);

GiaoAnSchema.index({
  ten: 'text',
  nganh: 'text',
  muc_dich: 'text',
  yeu_cau: 'text',
  trang_thai: 'text',
});
