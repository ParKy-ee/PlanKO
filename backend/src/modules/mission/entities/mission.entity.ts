import { Program } from "../../program/entities/program.entity";
import { Status } from "../../../commons/enums/status.enum";
import { User } from "../../../modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MissionByProgram } from "../../mission-by-program/entities/mission-by-program.entity";


@Entity({ name: 'mission' })
export class Mission {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.missions)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(
        () => MissionByProgram,
        (missionByProgram) => missionByProgram.mission
    )
    missionByPrograms: MissionByProgram[];

    @Column({ type: 'varchar', length: 255 })
    target: string;

    @Column({ type: 'timestamp' })
    startAt: Date;

    @Column({ type: 'timestamp' })
    endAt: Date;

    @Column({ type: 'enum', enum: Status })
    status: Status;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}