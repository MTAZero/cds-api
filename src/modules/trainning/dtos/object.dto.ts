import { Type } from 'class-transformer';
import { IsArray, IsDate, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TYPE_POSITION } from 'src/const';

export class ObjectDto {
    @IsNotEmpty()
    @IsIn(TYPE_POSITION)
    object: string

    @IsNotEmpty()
    @IsArray()
    time: []
}