import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMonthlyPlanDto {

  @IsMongoId()
  @IsNotEmpty()
  unit: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nhiem_vu: string;

  @IsOptional()
  @IsString()
  yeu_cau: string;

  @IsOptional()
  @IsString()
  bao_dam_thuc_hien: string;

  @IsOptional()
  @IsString()
  to_chuc_thuc_hien: string;

  @IsOptional()
  @IsNumber()
  ts: number;

  @IsOptional()
  @IsNumber()
  created_date: number;

  @IsOptional()
  @IsNumber()
  last_update: number;
}
