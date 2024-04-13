import { IsMongoId, IsOptional, IsString } from 'class-validator';

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
}
