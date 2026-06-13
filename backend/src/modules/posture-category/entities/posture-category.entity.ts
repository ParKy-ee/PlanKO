import { Posture } from "../../../modules/posture/entities/posture.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PostureCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Posture, (posture) => posture.postureCategory)
    postures: Posture[];

    @Column()
    description: string;
    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
