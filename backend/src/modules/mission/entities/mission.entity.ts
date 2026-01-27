import { Status } from "../../../commons/enums/status.enum";
import { User } from "../../../modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'mission' })
export class Mission {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.missions)
    @JoinColumn({ name: 'userId', })
    user: User;

    @Column({ type: 'varchar', length: 255 })
    target: string;

    @Column({ type: 'timestamp' })
    startAt: Date;

    @Column({ type: 'timestamp' })
    endAt: Date;

    @Column({ type: 'enum', enum: Status })
    status: Status;


    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

}
