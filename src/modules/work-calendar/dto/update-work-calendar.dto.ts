import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WorkCalendarAssignDto } from './create-work-calendar.dto';

export class UpdateWorkCalendarDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  lead: string;

  @IsNumber()
  @IsOptional()
  time_start: string;

  @IsNumber()
  @IsOptional()
  time_end: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkCalendarAssignDto)
  assigns: WorkCalendarAssignDto[];
}
