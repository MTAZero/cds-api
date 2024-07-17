import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDeliveryBillDto {

  @IsOptional()
  @IsString()
  deliveryUnit: string;

  @IsOptional()
  @IsString()
  receiveUnit: string;

  @IsOptional()
  @IsString()
  exportProperty: string;

  @IsOptional()
  @IsString()
  belongCommandID: string;

  @IsOptional()
  @IsString()
  receiver: string;

  @IsOptional()
  @IsString()
  referral: string;

  @IsOptional()
  @IsString()
  numberBill: string;

  @IsOptional()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  expiryDate: string;

  @IsOptional()
  @IsString()
  shippingUnit: string;

  @IsOptional()
  @IsString()
  license: string;

  @IsOptional()
  @IsString()
  designCapacity: string;

  @IsOptional()
  @IsString()
  exportCapacity: string;

  @IsOptional()
  @IsString()
  numberOfPackages: string;

  @IsOptional()
  @IsArray()
  materials: [];

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  deliverier: string;

  @IsOptional()
  @IsString()
  financePerson: string;

  @IsOptional()
  @IsString()
  createdPerson: string;

  @IsOptional()
  @IsString()
  leader: string;
}