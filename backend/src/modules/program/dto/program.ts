import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ProgramType } from "../../../commons/enums/prtogram-type.enum";

export class ProgramDto {

    @IsOptional()
    @IsNumber()
    missionByProgramId?: number;
    @IsOptional()
    @IsString()
    programName?: string;
    @IsOptional()
    @IsEnum(ProgramType)
    programType?: ProgramType;
    @IsOptional()
    @IsNumber()
    period?: number;
    @IsOptional()
    @IsNumber()
    frequency?: number;
    @IsOptional()
    @IsNumber({}, { each: true })
    workDays?: number[];
    @IsOptional()
    @IsNumber({}, { each: true })
    restDays?: number[];
    @IsOptional()
    @IsNumber()
    total_kcal?: number;

}
