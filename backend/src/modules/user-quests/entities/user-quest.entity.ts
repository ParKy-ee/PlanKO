import { IsActive } from "src/commons/enums/is-Active.enum";
import { Quest } from "src/modules/quests/entities/quest.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user_quests" })
export class UserQuest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ManyToOne(() => Quest, (quest) => quest.id)
    quest_id: number;

    @Column()
    user_id: number;

    @Column()
    current_value: number;


    @Column({ enum: IsActive, default: IsActive.ACTIVE })
    is_active: IsActive;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: new Date() })
    updatedAt: Date;
}
