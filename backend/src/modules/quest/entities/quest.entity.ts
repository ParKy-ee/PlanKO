import { QuestByUser } from "../../quest-by-uesr/entities/quest-by-uesr.entity";
import { Difficulty } from "../../../commons/enums/difficulty.enum";
import { QuestType } from "../../../commons/enums/quest-type.enum";
import { Unit } from "../../../commons/enums/unit.enum";
import { QuestCategory } from "../../quest-category/entities/quest-category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "quest" })
export class Quest {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => QuestByUser, (questByUser) => questByUser.quest)
    quests: QuestByUser[];

    @Column()
    name: string;

    @Column()
    goal_value: number;

    @Column({ type: 'enum', enum: Unit })
    unit: Unit;

    @Column({ type: 'enum', enum: QuestType })
    quest_type: QuestType;

    @Column()
    xp_reward: number;

    @Column()
    coin_reward: number;

    @Column({ type: 'enum', enum: Difficulty })
    difficulty: Difficulty;

    @ManyToOne(() => QuestCategory, (questCategory) => questCategory.id)
    @JoinColumn({ name: 'quest_category_id' })
    questCategory: QuestCategory;

    @Column()
    description?: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
