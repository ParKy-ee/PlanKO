import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateQuestCategoryDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
