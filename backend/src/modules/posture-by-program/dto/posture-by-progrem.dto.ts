import { IsNumber, IsOptional } from "class-validator";

export class PostureByProgramDto {
    @IsNumber()
    @IsOptional()
    programId: number;

    @IsNumber()
    @IsOptional()
    postureId: number;


}
