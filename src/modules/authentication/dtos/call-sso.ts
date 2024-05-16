import { IsNotEmpty, IsString, MinLength, minLength } from 'class-validator';

export class CallSSO {
  @IsString()
  @IsNotEmpty()
  grant_type: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  redirect_uri: string;

  @IsString()
  @IsNotEmpty()
  client_id: string;
}
