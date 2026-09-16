import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from './base-query.dto';

export class QuestCategoryDto extends BaseQueryDto {

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
