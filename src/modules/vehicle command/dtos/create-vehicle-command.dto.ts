import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVehicleCommandDto {

  @IsOptional()
  @IsString()
  orderNumber: string;

  @IsOptional()
  @IsString()
  commandDateCreated: string;

  @IsOptional()
  @IsString()
  baseFromDate: string;

  @IsOptional()
  @IsString()
  baseToDate: string;

  @IsOptional()
  @IsString()
  vehicle: string;

  @IsOptional()
  @IsString()
  mission: string;

  @IsOptional()
  @IsString()
  unitWorkGo: string;

  @IsOptional()
  @IsString()
  quantityGo: string;

  @IsOptional()
  @IsString()
  fromLocationGo: string;

  @IsOptional()
  @IsString()
  toLocationGo: string;

  @IsOptional()
  @IsString()
  distanceGo: string;

  @IsOptional()
  @IsString()
  numberTripGo: string;

  @IsOptional()
  @IsString()
  unitWorkBack: string;

  @IsOptional()
  @IsString()
  quantityBack: string;

  @IsOptional()
  @IsString()
  fromLocationBack: string;

  @IsOptional()
  @IsString()
  toLocationBack: string;

  @IsOptional()
  @IsString()
  distanceBack: string;

  @IsOptional()
  @IsString()
  numberTripBack: string;

  @IsOptional()
  @IsString()
  extra: string;

  @IsOptional()
  @IsNumber()
  performDateTime: number;
}
