import { MissionByProgram } from "../../mission-by-program/entities/mission-by-program.entity";
import { ProgramType } from "../../../commons/enums/prtogram-type.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'program' })
export class Program {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(
        () => MissionByProgram,
        (missionByProgram) => missionByProgram.program
    )
    missionByPrograms: MissionByProgram[];

    @Column({ type: 'varchar', length: 255 })
    programName: string;

    @Column({ type: 'enum', enum: ProgramType })
    programType: ProgramType;

    @Column({ type: 'int' })
    period: number;

    @Column({ type: 'int' })
    frequency: number;

    @Column({ type: 'int', array: true })
    workDays: number[];

    @Column({ type: 'int', array: true })
    restDays: number[];

    @Column({ type: 'varchar', length: 255 })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}