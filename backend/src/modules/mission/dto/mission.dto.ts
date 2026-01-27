import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../../../commons/enums/status.enum";

export class MissionDto {

    @IsOptional()
    @IsString()
    target?: string;

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