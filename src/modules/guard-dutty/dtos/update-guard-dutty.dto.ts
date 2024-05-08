import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateGuardDuttyDto {
  @IsMongoId()
  @IsOptional()
  user: string;

  @IsMongoId()
  @IsOptional()
  unit: string;
}
