import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

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
}
