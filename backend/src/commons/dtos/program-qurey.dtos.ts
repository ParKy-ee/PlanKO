import { BaseQueryDto } from "./base-query.dto";

export class ProgramQueryDto extends BaseQueryDto {

    missionByProgramId?: number;
    programName?: string;
    programType?: string;
    period?: number;
    frequency?: number;
    workDays?: number[];
    restDays?: number[];
    status?: string;
}