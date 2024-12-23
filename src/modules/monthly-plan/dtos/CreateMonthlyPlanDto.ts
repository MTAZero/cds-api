import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMonthlyPlanDto {

  @IsMongoId()
  @IsNotEmpty()
  unit: string;

  @IsNotEmpty()
  @IsString()
  name: string;

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
