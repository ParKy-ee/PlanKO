import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class PostureDto {

    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    postureCategory?: number;

    @IsNumber()
    @IsOptional()
    postureByPrograms?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    status?: boolean;
}
