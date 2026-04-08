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
} from 'typeorm';
import { PlankSession } from '../../../modules/plank-session/entities/plank-session.entity';
import { QuestByUser } from '../../../modules/quest-by-uesr/entities/quest-by-uesr.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Mission, (mission) => mission.user)
  missions: Mission[];

  @OneToMany(() => PlankSession, (plankSession) => plankSession.user)
  plankSessions: PlankSession[];

  @OneToMany(() => QuestByUser, (questByUser) => questByUser.user)
  quests: QuestByUser[];


  @Column({ length: 100 })
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


