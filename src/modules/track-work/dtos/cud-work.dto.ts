import { IsArray } from 'class-validator';

export class CreateTrackWorkDto {
  @IsArray()
  listTrackWork: [];
}
