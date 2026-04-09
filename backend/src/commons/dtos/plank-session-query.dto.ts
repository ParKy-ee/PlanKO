import { IsOptional, IsString } from "class-validator";
import { BaseQueryDto } from "./base-query.dto";

export class PlankSessionQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}