import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseQueryDto } from "./base-query.dto";

export class PlankSessionQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsNumber()
    user_id: number;

    @IsOptional()
    @IsString()
    mode: string;

    @IsOptional()
    @IsBoolean()
    completed: boolean;

    @IsOptional()
    @IsNumber()
    total_score: number;

    @IsOptional()
    @IsNumber()
    duration: number;

    @IsOptional()
    @IsNumber()
    start_time: number;

    @IsOptional()
    @IsNumber()
    end_time: number;

}