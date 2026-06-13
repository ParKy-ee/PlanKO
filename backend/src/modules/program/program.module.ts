import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { PostureByProgram } from '../posture-by-program/entities/posture-by-program.entity';
import { ProgramPlan } from '../program-plan/entities/program-plan.entity';
import { PlankSession } from '../plank-session/entities/plank-session.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Program, PostureByProgram, ProgramPlan, PlankSession])],
  controllers: [ProgramController],
  providers: [ProgramService],
  exports: [ProgramService]
})
export class ProgramModule { }
