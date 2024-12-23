import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  IsIn,
  IsMongoId,
} from 'class-validator';
import { TrangThaiEnum } from 'src/modules/database/schemas/huan_luyen/giao_an.schema';

export class UpdateGiaoAnDto {
  @IsString()
  @IsOptional()
  ten?: string;

  @IsMongoId()
  @IsOptional()
  nguoi_xay_dung?: string; // Liên kết với user, phải là ObjectId

  @IsString()
  @IsOptional()
  nganh?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  thoi_gian_bat_dau_thong_qua?: Date;

  @IsString()
  @IsOptional()
  dia_diem_thong_qua?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  thoi_gian_ket_thuc_thong_qua?: Date;

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
  noi_dung_phe_duyet?: string;

  @IsString()
  @IsOptional()
  ket_luan_phe_duyet?: string;

  @IsMongoId()
  @IsOptional()
  nguoi_phe_duyet?: string; // Liên kết với user, phải là ObjectId

  @IsString()
  @IsOptional()
  muc_dich?: string;

  @IsString()
  @IsOptional()
  yeu_cau?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  thoi_gian_hoan_thanh_cong_tac_chuan_bi?: Date;

  @IsNumber()
  @IsOptional()
  thoi_gian_len_lop_ly_thuyet?: number;

  @IsNumber()
  @IsOptional()
  thoi_gian_len_lop_thuc_hanh?: number;

  @IsNumber()
  @IsOptional()
  kiem_tra?: number;

  @IsNumber()
  @IsOptional()
  tong_thoi_gian_len_lop?: number;

  @IsEnum(TrangThaiEnum)
  @IsOptional()
  @IsIn([
    TrangThaiEnum.DANG_XAY_DUNG,
    TrangThaiEnum.DA_PHE_DUYET,
    TrangThaiEnum.DA_XAY_DUNG,
    TrangThaiEnum.DA_THONG_QUA,
  ])
  trang_thai?: TrangThaiEnum;

  @IsMongoId()
  @IsOptional()
  don_vi?: string; // Liên kết với unit, phải là ObjectId

  @IsString()
  @IsOptional()
  file?: string;
}
