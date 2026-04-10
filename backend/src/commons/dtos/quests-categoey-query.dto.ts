import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from './base-query.dto';

export class QuestsCategortyQueryDto extends BaseQueryDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    is_active?: boolean;
}
