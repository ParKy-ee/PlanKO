import { Status } from "../../../commons/enums/status.enum";
import { User } from "../../../modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Quest } from "../../quest/entities/quest.entity";

@Entity({ name: "quest_by_user" })
export class QuestByUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.quests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Quest, (quest) => quest.quests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "quest_id" })
    quest: Quest;

    @Column()
    current_value: number;

    @Column()
    target_value: number;

    @Column({ type: 'enum', enum: Status })
    status: Status;

    @Column({ type: 'timestamp', nullable: true })
    completed_at: Date | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

