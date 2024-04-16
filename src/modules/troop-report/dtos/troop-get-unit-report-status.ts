import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class TroopGetUnitReportStatusDto {
  @IsMongoId()
  @IsOptional()
  unitId: ObjectId;

  @IsNotEmpty()
  @IsNumber()
  time: number;
}
