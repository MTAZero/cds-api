import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class TroopUnitGetDetailReportDto {
  @IsMongoId()
  @IsNotEmpty()
  unitId: ObjectId;

  @IsNotEmpty()
  @IsNumber()
  time: number;
}
