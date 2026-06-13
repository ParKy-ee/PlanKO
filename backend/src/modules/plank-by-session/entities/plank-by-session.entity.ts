import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlankSession } from "../../../modules/plank-session/entities/plank-session.entity";
import { Posture } from "../../../modules/posture/entities/posture.entity";

@Entity({ name: 'plank_by_session' })
export class PlankBySession {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlankSession, (plankSession) => plankSession.plankBySessions)
    @JoinColumn()
    plankSession: PlankSession;

    @ManyToOne(() => Posture, (posture) => posture.plankBySessions)
    @JoinColumn()
    posture: Posture;

    @Column()
    order: number;

    @Column()
    duration: number;

    @Column()
    rest: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
