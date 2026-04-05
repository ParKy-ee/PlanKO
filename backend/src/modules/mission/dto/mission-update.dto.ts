import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../../../commons/enums/status.enum";

export class MissionUpdatesDto {

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