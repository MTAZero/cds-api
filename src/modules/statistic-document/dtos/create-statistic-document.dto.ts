import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStatisticDocumentDto {

  @IsString()
  @IsNotEmpty()
  unitId: string;

  @IsString()
  @IsNotEmpty()
  documentName: string;

  @IsString()
  @IsOptional()
  dvt: string;

  @IsNumber()
  @IsNotEmpty()
  sum: number;

  @IsString()
  @IsOptional()
  publishYear: string;

  @IsString()
  @IsOptional()
  numberRegister: string;

  @IsNumber()
  @IsOptional()
  receivedDate: number;

  @IsString()
  @IsOptional()
  receiver: string;

  @IsNumber()
  @IsOptional()
  paidDate: number;

  @IsString()
  @IsOptional()
  payer: string;

  @IsNumber()
  @IsOptional()
  sumRemain: number;

  @IsString()
  @IsOptional()
  note: string;
}
