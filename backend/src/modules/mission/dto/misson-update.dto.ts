import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../../../commons/enums/status.enum";

export class MissionUpdateDto {

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
    @IsNumber()
    userId?: number;

}