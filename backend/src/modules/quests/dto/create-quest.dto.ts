import { IsActive } from "src/commons/enums/is-Active.enum";
import { Difficulty } from "src/commons/enums/difficulty.enum";

export class CreateQuestDto {
    quests_categorty_id: number;
    name: string;
    description: string;
    goal_value: number;
    unit: string;
    xp_reward: number;
    coin_reward: number;
    difficulty: Difficulty;
    is_active: IsActive;
}
