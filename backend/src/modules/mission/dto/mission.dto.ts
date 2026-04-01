import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../../../commons/enums/status.enum";
import { BaseQueryDto } from "src/commons/dtos/base-query.dto";

export class MissionDto extends BaseQueryDto {

    @IsOptional()
    @IsString()
    target?: string;

    @IsOptional()
    @IsNumber()
    missionByProgramId?: number;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsOptional()
    @IsDateString()
    startAt?: string;

    @IsOptional()
    @IsDateString()
    endAt?: string;

    @IsOptional()
    @IsString()
    userId?: string;

}