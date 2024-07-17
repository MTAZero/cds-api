import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkAddressDto {
  @IsArray()
  listWorkAddress: [];
}
