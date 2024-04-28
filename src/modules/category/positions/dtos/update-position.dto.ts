import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';
import { TYPE_POSITION } from 'src/const';

export class UpdatePositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(TYPE_POSITION)
  @IsOptional()
  type: string;
}