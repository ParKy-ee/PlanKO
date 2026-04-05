import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { DateStatus } from 'src/commons/enums/date-status.enum';


export class PlankSessionUpdateDto {
    @IsOptional()
    @IsNumber()
    user_id: number;

    @IsOptional()
    @IsNumber()
    start_time: number;

    @IsOptional()
    @IsNumber()
    end_time: number;

    @IsOptional()
    @IsString()
    mode: string;

    @IsOptional()
    @IsEnum(DateStatus)
    status: typeof DateStatus;

    @IsOptional()
    @IsNumber()
    total_score: number;

    @IsOptional()
    @IsBoolean()
    completed: boolean;
}
