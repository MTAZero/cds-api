import { IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TYPE_BOOK } from 'src/const';


export class UpdatePersonalDiaryDto {

    @IsNotEmpty()
    note: string;
}