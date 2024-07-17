import { IsArray } from 'class-validator';

export class CreateTrackDisciplineDto {
  @IsArray()
  listDiscipline: [];
}
