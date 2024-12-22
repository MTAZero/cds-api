import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMonthlyPlanDto {

    @IsNotEmpty()
    @IsString()
    unit: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    ts: number;

    @IsOptional()
    @IsNumber()
    created_date: number;

    @IsOptional()
    @IsNumber()
    last_update: number;
}