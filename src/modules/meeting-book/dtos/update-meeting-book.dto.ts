import { 
    IsMongoId, 
    IsNotEmpty, 
    IsNumber, 
    IsOptional,
    IsDate
} from 'class-validator';

export class UpdateMeetingBookDto {

    @IsMongoId()
    @IsNotEmpty()
    unit: string;

    @IsNotEmpty()
    date: Number;

    @IsOptional()
    dutyLeader: string;
  
    @IsOptional()
    dutySecondPerson: string;
  
    @IsOptional()
    dutyThirdPerson: string;
  
    @IsOptional()
    weaponsEquipment: string;
  
    @IsOptional()
    advantages: string;
  
    @IsOptional()
    disadvantages: string;
  
    @IsOptional()
    scheduleUnitNextDay: string;
  
    @IsOptional()
    concludeDutyLeader: string;
  
    @IsOptional()
    request: string;
  
    @IsOptional()
    opinion: string;
  
    @IsOptional()
    scheduleSuperiorUnitNextDay: string;
  
    @IsOptional()
    opinionSuperiorUnitNextDay: string;
  
    @IsOptional()
    type: string;
}