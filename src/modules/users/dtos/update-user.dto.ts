import { IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ListUserType } from 'src/const';

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
  @IsIn(ListUserType)
  type: string;
}
