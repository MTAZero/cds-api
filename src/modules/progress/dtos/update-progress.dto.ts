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

export class UpdateProgressDto {
  @IsString()
  @IsIn(DAY_OF_WEEK)
  @IsOptional()
  day_of_week: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date: string

  @IsString()
  @IsOptional()
  week: string

  @IsString()
  @IsOptional()
  month: string

  @IsString()
  @IsOptional()
  year: string

  @IsString()
  @IsOptional()
  content: string

  @IsString()
  @IsOptional()
  sum_time_train: string

  @IsNotEmpty()
  // @ValidateNested({ each: true })
  // @Type(() => ObjectDto )
  time_train_detail: string

  @IsString()
  @IsOptional()
  unit_charge: string

  @IsString()
  @IsOptional()
  location: string

  @IsString()
  @IsOptional()
  guaranteed_material: string

  @IsMongoId()
  @IsNotEmpty()
  unit: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  from_date: Date

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  to_date: Date
}