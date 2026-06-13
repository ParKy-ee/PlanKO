
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseQueryDto } from "./base-query.dto";


export class MissionQueryDto extends BaseQueryDto {

    @IsOptional()
    @IsString()
    userId?: string;
    @IsOptional()
    @IsString()
    title?: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsString()
    status?: string;
    @IsOptional()
    @IsDate()
    start_date?: Date;
    @IsOptional()
    @IsDate()
    end_date?: Date;


}
