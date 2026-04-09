import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../../../commons/enums/status.enum";
import { BaseQueryDto } from "src/commons/dtos/base-query.dto";

export class MissionUpdateDto {


    @IsString()
    target: string;

    @IsNumber()
    missionByProgramId: number;

    @IsEnum(Status)
    status: Status;

    @IsDateString()
    startAt: string;

    @IsDateString()
    endAt: string;

    @IsString()
    userId: string;

}