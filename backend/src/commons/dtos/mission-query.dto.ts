import { BaseQueryDto } from "./base-query.dto";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class MissionQueryDto extends BaseQueryDto {

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
