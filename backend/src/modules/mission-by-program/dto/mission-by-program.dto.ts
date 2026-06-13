import { IsNotEmpty } from "class-validator";

export class MissionByProgramDto {

    @IsNotEmpty()
    missionId: number;

    @IsNotEmpty()
    programId: number;
}