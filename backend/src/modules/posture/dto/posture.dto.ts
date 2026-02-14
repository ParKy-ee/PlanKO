import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class PostureDto {

    @IsString()
    @IsOptional()
    postureName?: string;
    @IsString()
    @IsOptional()
    postureType?: string;
    @IsString()
    @IsOptional()
    postureDescription?: string;

    @IsNumber()
    @IsOptional()
    set?: number
    @IsNumber()
    @IsOptional()
    second?: number
    @IsBoolean()
    @IsOptional()
    status?: boolean;
}
