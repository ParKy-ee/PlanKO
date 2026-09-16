import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Program } from "../../program/entities/program.entity";
import { PlankSession } from "../../plank-session/entities/plank-session.entity";

@Entity({ name: "program_plan" })
export class ProgramPlan {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Program, (program) => program.programPlans, { onDelete: "CASCADE" })
    @JoinColumn({ name: "program_id" })
    program: Program;

    @ManyToOne(() => PlankSession, (plankSession) => plankSession.programPlans, { onDelete: "CASCADE" })
    @JoinColumn({ name: "plank_session_id" })
    plankSession: PlankSession;

    @Column()
    order: number;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
