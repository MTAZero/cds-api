import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsNumber, IsIn, IsMongoId } from 'class-validator';
import { TrangThaiEnum } from 'src/modules/database/schemas/huan_luyen/giao_an.schema';

export class CreateGiaoAnDto {
  @IsString()
  @IsNotEmpty()
  ten: string;

  @IsMongoId()
  @IsNotEmpty()
  nguoi_xay_dung: string; // Liên kết với user, phải là ObjectId

  @IsString()
  @IsNotEmpty()
  nganh: string;

  // @IsDate()
  // @IsNotEmpty()
  // @Type(() => Date)
  // thoi_gian_bat_dau_thong_qua: Date;

  @IsString()
  @IsNotEmpty()
  dia_diem_thong_qua: string;

  // @IsDate()
  // @IsNotEmpty()
  // @Type(() => Date)
  // thoi_gian_ket_thuc_thong_qua: Date;

  @IsString()
  @IsNotEmpty()
  dia_diem_phe_duyet: string;

  // @IsDate()
  // @IsNotEmpty()
  // @Type(() => Date)
  // thoi_gian_bat_dau_phe_duyet: Date;

  // @IsDate()
  // @IsNotEmpty()
  // @Type(() => Date)
  // thoi_gian_ket_thuc_phe_duyet: Date;

  @IsString()
  @IsNotEmpty()
  noi_dung_phe_duyet: string;

  @IsString()
  @IsNotEmpty()
  ket_luan_phe_duyet: string;

  @IsMongoId()
  @IsNotEmpty()
  nguoi_phe_duyet: string; // Liên kết với user, phải là ObjectId

  @IsString()
  @IsNotEmpty()
  muc_dich: string;

  @IsString()
  @IsNotEmpty()
  yeu_cau: string;

  // @IsDate()
  // @IsNotEmpty()
  // @Type(() => Date)
  // thoi_gian_hoan_thanh_cong_tac_chuan_bi: Date;

  // @IsNumber()
  // @IsNotEmpty()
  // thoi_gian_len_lop_ly_thuyet: number;

  // @IsNumber()
  // @IsNotEmpty()
  // thoi_gian_len_lop_thuc_hanh: number;

  @IsNumber()
  @IsNotEmpty()
  kiem_tra: number;

  @IsNumber()
  @IsNotEmpty()
  tong_thoi_gian_len_lop: number;

  @IsEnum(TrangThaiEnum)
  @IsNotEmpty()
  @IsIn([
    TrangThaiEnum.DANG_XAY_DUNG,
    TrangThaiEnum.DA_PHE_DUYET,
    TrangThaiEnum.DA_XAY_DUNG,
    TrangThaiEnum.DA_THONG_QUA,
  ])
  trang_thai: TrangThaiEnum;

  @IsMongoId()
  @IsNotEmpty()
  don_vi: string; // Liên kết với unit, phải là ObjectId

  @IsString()
  @IsNotEmpty()
  file: string;
}