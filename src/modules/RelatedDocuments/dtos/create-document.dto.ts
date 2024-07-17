import { Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TYPE_BOOK } from 'src/const';

export class CreateRelatedDocumentDto {

    @IsNotEmpty()
    name: Number;

    @IsNotEmpty()
    type: Number;

}