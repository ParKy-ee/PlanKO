import { Role } from "../../../commons/enums/role.enum";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserDto {
    @IsString()
    @IsOptional()
    readonly name?: string;

    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @IsBoolean()
    @IsOptional()
    readonly isActive?: boolean;

    @IsEnum(Role)
    @IsOptional()
    readonly role?: Role;

    @IsString()
    @IsOptional()
    readonly password?: string;

    @IsNumber()
    @IsOptional()
    readonly weight?: number;

    @IsNumber()
    @IsOptional()
    readonly height?: number;

    @IsNumber()
    @IsOptional()
    readonly age?: number;

    @IsString()
    @IsOptional()
    readonly gender?: string;



}
