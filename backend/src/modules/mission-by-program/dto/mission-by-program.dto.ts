import { IsOptional } from "class-validator";

export class MissionByProgramDto {

    @IsOptional()
    missionId: number;

    @IsOptional()
    programId: number;
}