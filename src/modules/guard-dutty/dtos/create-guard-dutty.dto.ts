import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGuardDuttyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsNumber()
  rate: string;
}
