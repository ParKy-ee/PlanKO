import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateProgramPlanDto {
    @IsNumber()
    @IsNotEmpty()
    program_id: number;

    @IsNumber()
    @IsNotEmpty()
    plank_session_id: number;

    @IsNumber()
    @IsNotEmpty()
    order: number;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
