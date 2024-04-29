import { Type } from 'class-transformer';
import { 
  IsNumber, 
  IsOptional, 
  IsString, 
  IsArray
} from 'class-validator';


export class UpdateTrainingDto {
  @IsString()
  @IsOptional()
  progressID: string;

  @IsArray()
  @IsOptional()
  element_join: []

  @IsString()
  @IsOptional()
  evaluation: string

  @IsNumber()
  @IsOptional()
  time_train_actual: Number
}