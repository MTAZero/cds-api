import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsMongoId } from 'class-validator';
import { KeHoachTrangThaiEnum } from 'src/modules/database/schemas/huan_luyen/ke_hoach_thong_qua_giao_an.schema';

export class CreateKeHoachThongQuaGiaoAnDto {
  @IsMongoId()
  @IsNotEmpty()
  giao_an: string; // Liên kết với giao_an, phải là ObjectId

  @IsDate()
  @IsNotEmpty()
  thoi_gian: Date;

  @IsMongoId()
  @IsNotEmpty()
  don_vi: string; // Liên kết với unit, phải là ObjectId

  @IsMongoId()
  @IsNotEmpty()
  nguoi_phe_duyet: string; // Liên kết với user, phải là ObjectId

  @IsString()
  @IsNotEmpty()
  dia_diem_phe_duyet: string;

  @IsDate()
  @IsNotEmpty()
  thoi_gian_bat_dau_phe_duyet: Date;

  @IsDate()
  @IsNotEmpty()
  thoi_gian_ket_thuc_phe_duyet: Date;

  @IsString()
  @IsNotEmpty()
  dia_diem_thong_qua: string;

  @IsDate()
  @IsNotEmpty()
  thoi_gian_bat_dau_thong_qua: Date;

  @IsDate()
  @IsNotEmpty()
  thoi_gian_ket_thuc_thong_qua: Date;

  @IsString()
  @IsNotEmpty()
  noi_dung_phe_duyet: string;

  @IsString()
  @IsNotEmpty()
  ket_luan: string;

  @IsString()
  @IsNotEmpty()
  file: string;

  @IsEnum(KeHoachTrangThaiEnum)
  @IsNotEmpty()
  trang_thai: KeHoachTrangThaiEnum; // Sử dụng enum

  @IsString()
  @IsNotEmpty()
  nganh: string;
}
