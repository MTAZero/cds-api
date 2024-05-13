import { 
    IsMongoId, 
    IsNotEmpty, 
    IsNumber, 
    IsOptional,
    IsDate
} from 'class-validator';

export class UpdateExperienceBookDto {

    @IsMongoId()
    @IsOptional()
    unit: string;

    @IsOptional()
    year: Number;

    @IsOptional()
    month: Number;

    @IsOptional()
    week: Number;

    @IsOptional()
    date: Date;

    @IsOptional()
    time: string;

    @IsOptional()
    join: string;

    @IsOptional()
    resultTraining: string;

    @IsOptional()
    evaluation: string;
    
    @IsOptional()
    dutyNextWeek: string;

    @IsOptional()
    sign: string;
}