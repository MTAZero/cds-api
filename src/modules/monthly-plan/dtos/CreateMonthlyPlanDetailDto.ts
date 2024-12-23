import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { LoaiNoiDungHuanLuyenThang } from 'src/enums';

export class CreateMonthlyPlanDetailDto {

  @IsMongoId()
  @IsNotEmpty()
  ke_hoach_thang: string;

  @IsNotEmpty()
  @IsNumber()
  thu_tu: number;

  @IsOptional()
  @IsString()
  loai_noi_dung: LoaiNoiDungHuanLuyenThang;

  @IsOptional()
  @IsString()
  stt: string;

  @IsOptional()
  @IsString()
  tham_gia: string;

  @IsOptional()
  @IsString()
  noi_dung: string;

  @IsOptional()
  @IsString()
  cap_phu_trach: string;

  @IsOptional()
  @IsString()
  bien_phap_tien_hanh: string;

  @IsOptional()
  @IsNumber()
  created_date: number;

  @IsOptional()
  @IsNumber()
  last_update: number;

  @IsOptional()
  @IsNumber()
  tong_gio: number;

  @IsOptional()
  @IsNumber()
  tuan_1: number;
  
  @IsOptional()
  @IsNumber()
  tuan_2: number;

  @IsOptional()
  @IsNumber()
  tuan_3: number;

  @IsOptional()
  @IsNumber()
  tuan_4: number;

  @IsOptional()
  @IsNumber()
  tuan_5: number;
  
}