import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';


export class PlankSessionDto {
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
    @IsNumber()
    total_score: number;

    @IsOptional()
    @IsBoolean()
    completed: boolean;
}
