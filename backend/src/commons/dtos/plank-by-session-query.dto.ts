import { IsNumber, IsOptional } from "class-validator";
import { BaseQueryDto } from "./base-query.dto";

export class PlankBySessionQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsNumber()
    plankSessionId?: number;

    @IsOptional()
    @IsNumber()
    postureId?: number;
}
