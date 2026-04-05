import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../../../commons/enums/status.enum";

export class MissionCreateDto {

    @IsString()
    @IsNotEmpty()
    target: string;

    @IsNumber()
    @IsNotEmpty()
    missionByProgramId: number;

    @IsEnum(Status)
    @IsNotEmpty()
    status: Status;

    @IsDateString()
    @IsNotEmpty()
    startAt: string;

    @IsDateString()
    @IsNotEmpty()
    endAt: string;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

}