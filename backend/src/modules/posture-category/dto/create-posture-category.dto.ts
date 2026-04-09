import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostureCategoryDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

}
