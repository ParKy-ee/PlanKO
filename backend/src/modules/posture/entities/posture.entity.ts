import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostureByProgram } from "../../../modules/posture-by-program/entities/posture-by-program.entity";
import { PostureCategory } from "../../../modules/posture-category/entities/posture-category.entity";
import { PlankBySession } from "../../../modules/plank-by-session/entities/plank-by-session.entity";
import { Difficulty } from "../../../commons/enums/difficulty.enum";

@Entity({ name: 'posture' })
export class Posture {
    @PrimaryGeneratedColumn()
    id: number;


    @OneToMany(() => PostureByProgram, (postureByProgram) => postureByProgram.posture)
    postureByPrograms: PostureByProgram[];

    @ManyToOne(() => PostureCategory, (postureCategory) => postureCategory.postures)
    @JoinColumn()
    postureCategory: PostureCategory;

    @OneToMany(() => PlankBySession, (plankBySession) => plankBySession.posture)
    plankBySessions: PlankBySession[];

    @Column({ type: 'enum', enum: Difficulty })
    difficulty: Difficulty;


    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    benefit: string;

    @Column({ type: 'varchar', length: 255 })
    posture_position: string;


    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
