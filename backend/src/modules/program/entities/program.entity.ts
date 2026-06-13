import { MissionByProgram } from "../../mission-by-program/entities/mission-by-program.entity";
import { ProgramType } from "../../../commons/enums/prtogram-type.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostureByProgram } from "../../posture-by-program/entities/posture-by-program.entity";
import { ProgramPlan } from "../../program-plan/entities/program-plan.entity";

@Entity({ name: 'program' })
export class Program {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(
        () => MissionByProgram,
        (missionByProgram) => missionByProgram.program
    )
    missionByPrograms: MissionByProgram[];

    @OneToMany(() => ProgramPlan, (programPlan) => programPlan.program)
    programPlans: ProgramPlan[];


    @Column({ type: 'varchar', length: 255 })
    programName: string;

    @Column({ type: 'enum', enum: ProgramType })
    programType: ProgramType;

    @Column({ type: 'int' })
    period: number;

    @Column({ type: 'int' })
    frequency: number;

    @OneToMany(() => PostureByProgram, (postureByProgram) => postureByProgram.program)
    postureByPrograms: PostureByProgram[];


    @Column({ type: 'int', array: true })
    workDays: number[];

    @Column({ type: 'int', array: true })
    restDays: number[];

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}