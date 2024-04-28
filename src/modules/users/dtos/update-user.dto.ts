import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { LIST_USER_TYPES, RANK } from 'src/const';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  full_name: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsMongoId()
  @IsOptional()
  unit: string;

  @IsMongoId()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  @IsIn(LIST_USER_TYPES)
  type: string;

  @IsBoolean()
  @IsOptional()
  isPersonal: boolean;
  
  @IsMongoId()
  @IsOptional()
  position: string;

  @IsIn(RANK)
  @IsOptional()
  rank: string;

}
