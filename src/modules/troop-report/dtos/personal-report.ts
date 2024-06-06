import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { LIST_TROOP_STATUS, LIST_TROOP_STATUS_FULL } from 'src/const';

export class PersonalReportDto {
  @IsNotEmpty()
  @IsNumber()
  time: number;

  @IsString()
  @IsIn(LIST_TROOP_STATUS_FULL)
  status;
}
