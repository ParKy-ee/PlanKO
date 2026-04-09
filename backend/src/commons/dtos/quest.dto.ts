import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { QuestType } from 'src/commons/enums/quest-type.enum';
import { Difficulty } from 'src/commons/enums/difficulty.enum';
import { Unit } from 'src/commons/enums/unit.enum';
import { BaseQueryDto } from './base-query.dto';

export class QuestDto extends BaseQueryDto {

    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    goal_value?: number;

    @IsEnum(Unit)
    @IsOptional()
    unit?: Unit;

    @IsEnum(QuestType)
    @IsOptional()
    quest_type?: QuestType;

    @IsNumber()
    @IsOptional()
    xp_reward?: number;

    @IsNumber()
    @IsOptional()
    coin_reward?: number;

    @IsEnum(Difficulty)
    @IsOptional()
    difficulty?: Difficulty;

    @IsNumber()
    @IsOptional()
    quest_category_id?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
