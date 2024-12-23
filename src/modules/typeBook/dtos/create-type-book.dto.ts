import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTypeBookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  description: string;
}
