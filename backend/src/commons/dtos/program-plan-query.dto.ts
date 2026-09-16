import { IsNumber, IsOptional, IsString } from "class-validator";
import { BaseQueryDto } from "./base-query.dto";

export class ProgramPlanQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsString()
    programId?: string;

    @IsOptional()
    @IsString()
    plankSessionId?: string;
}
