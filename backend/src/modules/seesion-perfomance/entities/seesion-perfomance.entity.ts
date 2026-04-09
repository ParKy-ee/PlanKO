import { User } from "../../../modules/user/entities/user.entity";
import { PlankSession } from "../../../modules/plank-session/entities/plank-session.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "session_perfomance" })
export class SessionPerfomance {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlankSession, (plankSession) => plankSession.plankBySessions, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "plank_session_id" })
    plankSession: PlankSession;


    @ManyToOne(() => User, (user) => user.sessionPerfomances, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    accuracy_avg: number;

    @Column()
    perfect_count: number;

    @Column()
    good_count: number;

    @Column()
    bad_count: number;

    @Column()
    missed_count: number;

    @Column()
    score: number;

    @Column()
    completed: boolean;

    @Column()
    start_time: string;

    @Column()
    end_time: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
