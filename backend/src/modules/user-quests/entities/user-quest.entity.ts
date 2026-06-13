
import { Quest } from "../../../modules/quest/entities/quest.entity";
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


    @Column({ default: true })
    is_active: boolean;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: new Date() })
    updatedAt: Date;
}
