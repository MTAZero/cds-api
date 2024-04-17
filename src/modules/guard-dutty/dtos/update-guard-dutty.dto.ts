import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGuardDuttyDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsNumber()
  rate: string;
}
