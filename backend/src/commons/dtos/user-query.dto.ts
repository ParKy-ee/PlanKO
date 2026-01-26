import { IsBoolean, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { BaseQueryDto } from "./base-query.dto";

export class UserQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    email?: string;


    @IsOptional()
    @IsString()
    role?: string;
}