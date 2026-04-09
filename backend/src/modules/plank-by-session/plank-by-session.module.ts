import { Module } from '@nestjs/common';
import { PlankBySessionService } from './plank-by-session.service';
import { PlankBySessionController } from './plank-by-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlankBySession } from './entities/plank-by-session.entity';
import { PlankSession } from '../plank-session/entities/plank-session.entity';
import { Posture } from '../posture/entities/posture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlankBySession, PlankSession, Posture])],
  controllers: [PlankBySessionController],
  providers: [PlankBySessionService],
})
export class PlankBySessionModule { }
