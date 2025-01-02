import { Type } from 'class-transformer';
import { IsString, IsOptional, IsEnum, IsDate, IsMongoId, IsNumber } from 'class-validator';
import { KeHoachTrangThaiEnum } from 'src/modules/database/schemas/huan_luyen/ke_hoach_thong_qua_giao_an.schema';

export class UpdateKeHoachThongQuaGiaoAnDto {
  @IsMongoId()
  @IsOptional()
  giao_an?: string; // Liên kết với giao_an, phải là ObjectId

  @IsNumber()
  @IsOptional()
  thoi_gian?: number;

  @IsMongoId()
  @IsOptional()
  don_vi?: string; // Liên kết với unit, phải là ObjectId

  @IsMongoId()
  @IsOptional()
  nguoi_phe_duyet?: string; // Liên kết với user, phải là ObjectId

  @IsString()
  @IsOptional()
  dia_diem_phe_duyet?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  thoi_gian_bat_dau_phe_duyet?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  thoi_gian_ket_thuc_phe_duyet?: Date;

  @IsString()
  @IsOptional()
  dia_diem_thong_qua?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  thoi_gian_bat_dau_thong_qua?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  thoi_gian_ket_thuc_thong_qua?: Date;

  @IsString()
  @IsOptional()
  noi_dung_phe_duyet?: string;

  @IsString()
  @IsOptional()
  ket_luan?: string;

  @IsString()
  @IsOptional()
  file?: string;

  @IsEnum(KeHoachTrangThaiEnum)
  @IsOptional()
  trang_thai?: KeHoachTrangThaiEnum; // Sử dụng enum

  @IsString()
  @IsOptional()
  nganh?: string;
}