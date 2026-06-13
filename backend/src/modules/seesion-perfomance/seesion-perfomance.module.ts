import { Module } from '@nestjs/common';
import { SeesionPerfomanceService } from './seesion-perfomance.service';
import { SeesionPerfomanceController } from './seesion-perfomance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionPerfomance } from '../../modules/seesion-perfomance/entities/seesion-perfomance.entity';
import { PlankSession } from '../plank-session/entities/plank-session.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionPerfomance, PlankSession, User])],
  controllers: [SeesionPerfomanceController],
  providers: [SeesionPerfomanceService],
})
export class SeesionPerfomanceModule { }
