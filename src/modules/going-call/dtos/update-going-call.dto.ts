import {  IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGoingCallDto {

  @IsOptional()
  @IsNumber()
  dateTransfer: number;

  @IsOptional()
  @IsString()
  personTransfer: string;

  @IsOptional()
  @IsString()
  rankTransfer: string;

  @IsOptional()
  @IsString()
  positionTransfer: string;

  @IsOptional()
  @IsString()
  unitIdTransfer: string;
  
  @IsOptional()
  @IsString()
  telephoneNumberTransfer: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  personReceived: string;

  @IsOptional()
  @IsString()
  positionReceived: string;

  @IsOptional()
  @IsString()
  rankReceived: string;

  @IsOptional()
  @IsString()
  unitIdReceived: string;

  @IsOptional()
  @IsNumber()
  dateReceived: number;

  @IsOptional()
  @IsString()
  telephoneNumberReceived: string;

  @IsOptional()
  @IsString()
  idLeader: string;
}

