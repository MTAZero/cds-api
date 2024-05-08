import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGuardDuttyPositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsNumber()
  @IsNotEmpty()
  priority_display: number;

  @IsString()
  @IsOptional()
  note: string;

  @IsBoolean()
  @IsNotEmpty()
  is_generate: boolean;

  @IsOptional()
  @IsNumber()
  rate: number;
}
