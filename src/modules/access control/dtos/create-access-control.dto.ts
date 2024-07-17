import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccessControlDto {

  @IsNumber()
  @IsNotEmpty()
  date: number;

  @IsString()
  @IsOptional()
  unitId: string;

  @IsString()
  @IsOptional()
  pickPersonName: string;

  @IsOptional()
  guestName: [];

  @IsString()
  @IsOptional()
  typeVehicle: string;

  @IsString()
  @IsOptional()
  license: string;

  @IsString()
  @IsOptional()
  identityNumber: string;

  @IsNumber()
  @IsOptional()
  issued: number;

  @IsString()
  @IsOptional()
  addressIssued: string;

  @IsString()
  @IsOptional()
  contentWork: string;

  @IsNumber()
  @IsOptional()
  fromDateTime: number;

  @IsNumber()
  @IsOptional()
  toDateTime: number;

  @IsString()
  @IsOptional()
  note: string;

}
