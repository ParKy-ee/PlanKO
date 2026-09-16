import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Difficulty } from "../../../commons/enums/difficulty.enum";

export class PostureDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    postureCategory: number;

    @IsEnum(Difficulty)
    difficulty: Difficulty;

    @IsString()
    description: string;

}
