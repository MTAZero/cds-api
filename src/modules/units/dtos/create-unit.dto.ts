import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsMongoId()
  @IsOptional()
  parent: ObjectId;
}
