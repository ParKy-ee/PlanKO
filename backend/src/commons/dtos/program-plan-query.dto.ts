import { IsNumber, IsOptional } from "class-validator";
import { BaseQueryDto } from "./base-query.dto";

export class ProgramPlanQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsNumber()
    program_id?: number;

    @IsOptional()
    @IsNumber()
    plank_session_id?: number;
}
