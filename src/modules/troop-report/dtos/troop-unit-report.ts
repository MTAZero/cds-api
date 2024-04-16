import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { LIST_TROOP_STATUS } from 'src/const';

class AbsentTroopDto {
  @IsMongoId()
  @IsNotEmpty()
  user: ObjectId;

  @IsString()
  @IsIn(LIST_TROOP_STATUS)
  reason;
}

export class TroopUnitReportDto {
  @IsNotEmpty()
  @IsNumber()
  time: number;

  @IsMongoId()
  @IsNotEmpty()
  unit: ObjectId;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AbsentTroopDto)
  absentTroops: AbsentTroopDto[];
}
