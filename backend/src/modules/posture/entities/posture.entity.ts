import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostureByProgram } from "../../../modules/posture-by-program/entities/posture-by-program.entity";

@Entity({ name: 'posture' })
export class Posture {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => PostureByProgram, (postureByProgram) => postureByProgram.posture)
    postureByPrograms: PostureByProgram[];

    @Column({ type: 'varchar', length: 255 })
    postureName: string;

    @Column({ type: 'varchar', length: 255 })
    postureType: string;

    @Column({ type: 'varchar', length: 255 })
    postureDescription: string;

    @Column({ type: 'boolean', default: true })
    status: boolean;

    @Column({ type: 'int', default: 1 })
    set: number;

    @Column({ type: 'int', default: 1 })
    second: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
