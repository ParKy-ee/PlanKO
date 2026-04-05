import { Difficulty } from "src/commons/enums/difficulty.enum";
import { IsActive } from "src/commons/enums/is-Active.enum";
import { QuestsCategorty } from "src/modules/quests-categorty/entities/quests-categorty.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "quest" })
export class Quest {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ManyToOne(() => QuestsCategorty, (questsCategorty) => questsCategorty.id)
    quests_categorty_id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    goal_value: number;

    @Column()
    unit: string;

    @Column()
    xp_reward: number;

    @Column()
    coin_reward: number;

    @Column({ enum: Difficulty })
    difficulty: Difficulty;


    @Column({ enum: IsActive, default: IsActive.ACTIVE })
    is_active: IsActive;


    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: new Date() })
    updatedAt: Date;
}
