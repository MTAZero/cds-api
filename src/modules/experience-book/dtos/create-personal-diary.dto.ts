import { Type } from 'class-transformer';
import { IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TYPE_BOOK } from 'src/const';

export class CreatePersonalDiaryDto {

    @IsMongoId()
    @IsOptional()
    training: string;

    @IsNotEmpty()
    @IsIn(TYPE_BOOK)
    type: string

    @IsNotEmpty()
    note: string;
}