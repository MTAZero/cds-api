import { Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TYPE_BOOK } from 'src/const';

export class CreateExperienceBookDto {

    @IsMongoId()
    @IsNotEmpty()
    unit: string;

    @IsNotEmpty()
    year: Number;

    @IsNotEmpty()
    month: Number;

    @IsNotEmpty()
    week: Number;

    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    time: string;

    @IsNotEmpty()
    join: string;

    @IsNotEmpty()
    resultTraining: string;

    @IsNotEmpty()
    evaluation: string;
    
    @IsOptional()
    dutyNextWeek: string;

    @Prop()
    sign: string;
}