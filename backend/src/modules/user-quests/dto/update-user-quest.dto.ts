import { IsActive } from 'src/commons/enums/is-Active.enum';

export class UpdateUserQuestDto {
    quest_id?: number;
    user_id?: number;
    current_value?: number;
    is_active?: IsActive;
}
