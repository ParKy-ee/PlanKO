import { Posture } from "../../../modules/posture/entities/posture.entity";
import { Program } from "../../../modules/program/entities/program.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'posture_by_program' })
export class PostureByProgram {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    programId: number;

    @ManyToOne(() => Program, (program) => program.postureByPrograms, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'programId' })
    program: Program;

    @Column({ type: 'int' })
    postureId: number;

    @ManyToOne(() => Posture, (posture) => posture.postureByPrograms, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'postureId' })
    posture: Posture;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
