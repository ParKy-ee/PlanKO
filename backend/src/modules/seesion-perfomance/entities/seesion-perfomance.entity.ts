import { PlankSession } from "../../../modules/plank-session/entities/plank-session.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "session_perfomance" })
export class SessionPerfomance {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlankSession, (plankSession) => plankSession.sessionPerfomances, { onDelete: "CASCADE" })
    @JoinColumn({ name: "plank_session_id" })
    plankSession: PlankSession;

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
    figure_count: number;


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
