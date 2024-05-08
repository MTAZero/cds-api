import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateGuardDuttyPositionDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsMongoId()
  @IsOptional()
  unit: string;

  @IsNumber()
  @IsOptional()
  number: number;

  @IsNumber()
  @IsOptional()
  priority_display: number;

  @IsString()
  @IsOptional()
  note: string;

  @IsBoolean()
  @IsOptional()
  is_generate: boolean;

  @IsOptional()
  @IsNumber()
  rate: number;
}
