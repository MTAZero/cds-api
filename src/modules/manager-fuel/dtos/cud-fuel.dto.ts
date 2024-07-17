import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFuelDto {
  @IsArray()
  listFuel: [];
}
