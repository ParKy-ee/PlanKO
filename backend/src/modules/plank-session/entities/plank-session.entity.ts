
import { SessionPerfomance } from "../../../modules/seesion-perfomance/entities/seesion-perfomance.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlankBySession } from "../../../modules/plank-by-session/entities/plank-by-session.entity";
import { ProgramPlan } from "../../program-plan/entities/program-plan.entity";


@Entity({ name: "plank_session" })
export class PlankSession {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => PlankBySession, (plankBySession) => plankBySession.plankSession)
    plankBySessions: PlankBySession[];

    @OneToMany(() => SessionPerfomance, (sessionPerfomance) => sessionPerfomance.plankSession)
    sessionPerfomances: SessionPerfomance[];

    @OneToMany(() => ProgramPlan, (programPlan) => programPlan.plankSession)
    programPlans: ProgramPlan[];


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
