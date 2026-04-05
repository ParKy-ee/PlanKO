import { IsOptional, IsString } from 'class-validator';
import { IsActive } from "src/commons/enums/is-Active.enum";

export class CreateQuestsCategortyDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    is_active?: IsActive;
}
