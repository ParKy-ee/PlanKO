
import { SessionPerfomance } from "../../../modules/seesion-perfomance/entities/seesion-perfomance.entity";
import { User } from "../../../modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DateStatus } from "../../../commons/enums/date-status.enum";
import { Posture } from "../../../modules/posture/entities/posture.entity";
import { PlankBySession } from "../../../modules/plank-by-session/entities/plank-by-session.entity";


@Entity({ name: "plank_session" })
export class PlankSession {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => PlankBySession, (plankBySession) => plankBySession.plankSession)
    plankBySessions: PlankBySession[];

    @OneToMany(() => SessionPerfomance, (sessionPerfomance) => sessionPerfomance.plankSession)
    sessionPerfomances: SessionPerfomance[];

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    total_score: number;

    // @ManyToOne(() => User, (user) => user.plankSessions)
    // @JoinColumn({ name: "user_id" })
    // user: User;

    // @OneToMany(() => SessionPerfomance, (sessionPerfomance) => sessionPerfomance.plankSession)
    // sessionPerfomances: SessionPerfomance[];

    // @Column({ type: "timestamp" })
    // start_time: Date;

    // @Column({ type: "timestamp" })
    // end_time: Date;

    // @Column()
    // duration: number;

    // @Column()
    // mode: string;

    // @Column()
    // total_score: number;

    // @Column({ type: "enum", enum: DateStatus, default: DateStatus.PENDING })
    // status: typeof DateStatus;

    // @Column()
    // completed: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
