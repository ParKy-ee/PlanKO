import { Module } from '@nestjs/common';
import { PlankSessionService } from './plank-session.service';
import { PlankSessionController } from './plank-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlankSession } from '../../modules/plank-session/entities/plank-session.entity';
import { SessionPerfomance } from '../../modules/seesion-perfomance/entities/seesion-perfomance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlankSession, SessionPerfomance])],
  controllers: [PlankSessionController],
  providers: [PlankSessionService],
})
export class PlankSessionModule { }
