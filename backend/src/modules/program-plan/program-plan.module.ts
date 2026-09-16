import { Module } from '@nestjs/common';
import { ProgramPlanService } from './program-plan.service';
import { ProgramPlanController } from './program-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramPlan } from './entities/program-plan.entity';
import { PlankSession } from '../plank-session/entities/plank-session.entity';
import { Program } from '../program/entities/program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramPlan, PlankSession, Program])],
  controllers: [ProgramPlanController],
  providers: [ProgramPlanService],
  exports: [ProgramPlanService],
})
export class ProgramPlanModule { }
