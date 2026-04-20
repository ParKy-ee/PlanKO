import { Role } from '../../../commons/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { Mission } from '../../../modules/mission/entities/mission.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { QuestByUser } from '../../../modules/quest-by-uesr/entities/quest-by-uesr.entity';
import { SessionPerfomance } from '../../../modules/seesion-perfomance/entities/seesion-perfomance.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Mission, (mission) => mission.user, { onDelete: "CASCADE", nullable: true })
  missions: Mission[];

  @OneToMany(() => QuestByUser, (questByUser) => questByUser.user, { onDelete: "CASCADE", nullable: true })
  quests: QuestByUser[];

  @OneToMany(() => SessionPerfomance, (sessionPerfomance) => sessionPerfomance.user, { onDelete: "CASCADE", nullable: true })
  sessionPerfomances: SessionPerfomance[];


  @Column({ length: 100 })
  @Index({ unique: true })
  name: string;

  @Index({ unique: true })
  @Column({ length: 150 })
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: Role.USER })
  role: Role;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;


  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;
}


