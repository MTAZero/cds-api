import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ListUserType } from 'src/const';

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
  @IsIn(ListUserType)
  type: string;
}
