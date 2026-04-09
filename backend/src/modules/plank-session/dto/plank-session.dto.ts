import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class PlankSessionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    total_score: number;
}
