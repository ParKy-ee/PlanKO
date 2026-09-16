import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePlankBySessionDto {
    @IsNumber()
    @IsNotEmpty()
    plankSessionId: number;

    @IsNumber()
    @IsNotEmpty()
    postureId: number;

    @IsNumber()
    @IsNotEmpty()
    order: number;

    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @IsNumber()
    @IsNotEmpty()
    rest: number;
}
