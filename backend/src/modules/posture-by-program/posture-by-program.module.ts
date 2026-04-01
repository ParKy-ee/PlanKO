import { Module } from '@nestjs/common';
import { PostureByProgramService } from './posture-by-program.service';
import { PostureByProgramController } from './posture-by-program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostureByProgram } from './entities/posture-by-program.entity';
import { Program } from '../program/entities/program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostureByProgram, Program])],
  controllers: [PostureByProgramController],
  providers: [PostureByProgramService],
})
export class PostureByProgramModule { }
