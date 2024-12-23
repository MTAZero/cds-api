import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GiaoAn } from './giao_an.schema'; // Import bảng giao_an
import { Unit } from '../units.schema';
import { User } from '../users.schema';

// Enum cho trạng thái
export enum KeHoachTrangThaiEnum {
  DA_TAO_KE_HOACH = 'Đã tạo kế hoạch',
  DA_THONG_QUA = 'Đã thông qua',
  DA_PHE_DUYET = 'Đã phê duyệt',
  DANG_XAY_DUNG_KE_HOACH = 'Đang xây dựng kế hoạch',
}

@Schema()
export class KeHoachThongQuaGiaoAn extends Document<any> {
  _id: Types.ObjectId;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian: Date;

  @Prop({ type: Types.ObjectId, ref: Unit.name }) // Liên kết với bảng units
  don_vi: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name }) // Liên kết với bảng users
  nguoi_phe_duyet: Types.ObjectId;

  @Prop()
  dia_diem_phe_duyet: string;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_bat_dau_phe_duyet: Date;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_ket_thuc_phe_duyet: Date;

  @Prop()
  dia_diem_thong_qua: string;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_bat_dau_thong_qua: Date;

  @Prop({ type: Date }) // Dạng datetime
  thoi_gian_ket_thuc_thong_qua: Date;

  @Prop()
  noi_dung_phe_duyet: string;

  @Prop()
  ket_luan: string;

  @Prop()
  file: string;

  @Prop({ enum: KeHoachTrangThaiEnum }) // Định nghĩa enum trạng thái
  trang_thai: KeHoachTrangThaiEnum;

  @Prop()
  nganh: string;

  @Prop({ type: Types.ObjectId, ref: GiaoAn.name }) // Liên kết với bảng giao_an
  giao_an: Types.ObjectId;


  @Prop() // Dạng datetime
  created_date: number;

  @Prop() // Dạng datetime
  last_update: number;
}

export const KeHoachThongQuaGiaoAnSchema = SchemaFactory.createForClass(KeHoachThongQuaGiaoAn);

KeHoachThongQuaGiaoAnSchema.index({
  nganh: 'text',
  dia_diem_thong_qua: 'text',
  trang_thai: 'text',
});