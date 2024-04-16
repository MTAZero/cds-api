import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRegisterDto {
  @IsNumber()
  @IsNotEmpty()
  start_time: number;

  @IsNumber()
  @IsNotEmpty()
  end_time: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  contact: string;
}
