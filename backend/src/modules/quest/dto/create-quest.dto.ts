import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { QuestType } from 'src/commons/enums/quest-type.enum';
import { Difficulty } from 'src/commons/enums/difficulty.enum';
import { Unit } from 'src/commons/enums/unit.enum';

export class CreateQuestDto {
  @IsString()
  name: string;

  @IsNumber()
  goal_value: number;

  @IsEnum(Unit)
  unit: Unit;

  @IsEnum(QuestType)
  quest_type: QuestType;

  @IsNumber()
  xp_reward: number;

  @IsNumber()
  coin_reward: number;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsNumber()
  quest_category_id: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
