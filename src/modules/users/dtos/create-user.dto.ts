import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { LIST_USER_TYPES } from 'src/const';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsMongoId()
  @IsNotEmpty()
  unit: string;

  @IsMongoId()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(LIST_USER_TYPES)
  type: string;

  @IsBoolean()
  @IsNotEmpty()
  isPersonal: boolean;
}
