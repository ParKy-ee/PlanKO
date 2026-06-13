import { IsOptional } from "class-validator";

export class MissionByProgramUpdateDto {

    @IsOptional()
    missionId: number;

    @IsOptional()
    programId: number;
}