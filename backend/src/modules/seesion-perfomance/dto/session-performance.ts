import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';


export class PerfomanceDto {
    @IsOptional()
    @IsNumber()
    plank_session_id: number;

    @IsOptional()
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsNumber()
    total_score: number;

    @IsOptional()
    @IsNumber()
    duration: number;

    @IsOptional()
    @IsNumber()
    accuracy_avg: number;

    @IsOptional()
    @IsNumber()
    perfect_count: number;

    @IsOptional()
    @IsNumber()
    good_count: number;

    @IsOptional()
    @IsNumber()
    bad_count: number;

    @IsOptional()
    @IsNumber()
    missed_count: number;

    @IsOptional()
    @IsNumber()
    kcal: number;
}
