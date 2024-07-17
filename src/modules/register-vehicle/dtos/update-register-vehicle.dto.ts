import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRegisterVehicleDto {

  @IsString()
  @IsOptional()
  driver: string;

  @IsString()
  @IsOptional()
  rank: string;

  @IsString()
  @IsOptional()
  license: string;

  @IsString()
  @IsNotEmpty()
  contentUse: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  fromDateTime: number;
  
  @IsNumber()
  @IsNotEmpty()
  toDateTime: number;

  @IsString()
  @IsOptional()
  distance: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

}