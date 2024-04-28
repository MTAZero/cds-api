import { Type } from 'class-transformer';
import { 
  IsDate, 
  IsIn, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  ValidateNested,
  IsMongoId
 } from 'class-validator';
import { DAY_OF_WEEK } from 'src/const';
import { ObjectDto } from './object.dto';

export class CreateProgressDto {
  @IsString()
  @IsIn(DAY_OF_WEEK)
  @IsNotEmpty()
  day_of_week: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: string

  @IsNumber()
  @IsNotEmpty()
  week: Number

  @IsNumber()
  @IsNotEmpty()
  month: Number

  @IsNumber()
  @IsNotEmpty()
  year: Number

  @IsString()
  @IsNotEmpty()
  content: string

  @IsNumber()
  @IsNotEmpty()
  sum_time_train: Number

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ObjectDto )
  time_train_detail: ObjectDto[]

  @IsString()
  @IsNotEmpty()
  unit_charge: string

  @IsString()
  @IsNotEmpty()
  location: string

  @IsString()
  @IsNotEmpty()
  guaranteed_material: string

  @IsMongoId()
  @IsNotEmpty()
  unit: string

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  from_date: Date

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  to_date: Date
}