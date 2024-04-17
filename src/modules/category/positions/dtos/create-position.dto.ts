import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TYPE_POSITION } from 'src/const';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(TYPE_POSITION)
  @IsOptional()
  type: string;
}