import { Role } from "src/commons/enums/role.enums";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserDto {
    @IsString()
    @IsOptional()
    readonly name?: string;

    @IsEmail()
    @IsOptional()
    readonly email?: string;



}
