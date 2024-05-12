import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class WorkCalendarAssignDto {
  @IsMongoId()
  @IsOptional()
  user: ObjectId;

  @IsMongoId()
  @IsOptional()
  unit: ObjectId;

  @IsBoolean()
  @IsNotEmpty()
  isUnit: boolean;
}

export class CreateWorkCalendarDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  lead: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  time_start: string;

  @IsNumber()
  @IsNotEmpty()
  time_end: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WorkCalendarAssignDto)
  assigns: WorkCalendarAssignDto[];
}
