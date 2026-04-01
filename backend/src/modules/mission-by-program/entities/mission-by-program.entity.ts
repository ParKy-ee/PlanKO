import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Program } from "../../program/entities/program.entity";
import { Mission } from "../../mission/entities/mission.entity";
import { Posture } from "../../posture/entities/posture.entity";

@Entity({ name: 'mission_by_program' })
export class MissionByProgram {
    @PrimaryGeneratedColumn()
    id: number;

    // ===== Program =====
    @ManyToOne(() => Program, (program) => program.missionByPrograms, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'programId' })
    program: Program;



    @ManyToOne(() => Mission, (mission) => mission.missionByPrograms, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'missionId' })
    mission: Mission;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}