import { IsNumber, IsOptional } from "class-validator";
import { BaseQueryDto } from "./base-query.dto";

export class SessionPerformanceQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsNumber()
    plank_session_id: number;

    @IsOptional()
    @IsNumber()
    score: number;

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
    figure_count: number;

}