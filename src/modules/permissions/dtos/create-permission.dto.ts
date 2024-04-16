import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ACTIONS_SYSTEM, FEATURES_SYSTEM } from 'src/const';

export class CreatePermissionDto {
  @IsMongoId()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(FEATURES_SYSTEM)
  module: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(ACTIONS_SYSTEM)
  action: string;
}
