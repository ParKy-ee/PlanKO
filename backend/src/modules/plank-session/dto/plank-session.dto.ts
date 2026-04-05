import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { DateStatus } from 'src/commons/enums/date-status.enum';


export class PlankSessionDto {
    @IsNumber()
    user_id: number;

    @IsNumber()
    start_time: number;

    @IsNumber()
    end_time: number;

    @IsString()
    mode: string;

    @IsEnum(DateStatus)
    status: typeof DateStatus;

    @IsNumber()
    total_score: number;

    @IsBoolean()
    completed: boolean;
}
