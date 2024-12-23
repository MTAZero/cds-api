import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateIncomingCallDto {

  @IsNumber()
  @IsNotEmpty()
  dateRead: number;

  @IsString()
  @IsOptional()
  personRead: string;

  @IsString()
  @IsOptional()
  rankRead: string;

  @IsString()
  @IsOptional()
  positionRead: string;

  @IsString()
  @IsOptional()
  unitId: string;

  @IsString()
  @IsOptional()
  telephoneNumber: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  sign: string;

  @IsString()
  @IsOptional()
  personReceived: string;

  @IsString()
  @IsOptional()
  positionReceived: string;

  @IsString()
  @IsOptional()
  personSecondReceived: string;

  @IsNumber()
  @IsOptional()
  dateReceived: number;

  @IsString()
  @IsOptional()
  idLeader: string;
}
