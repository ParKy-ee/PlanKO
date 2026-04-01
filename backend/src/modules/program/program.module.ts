import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { PostureByProgram } from '../posture-by-program/entities/posture-by-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Program, PostureByProgram])],
  controllers: [ProgramController],
  providers: [ProgramService],
  exports: [ProgramService]
})
export class ProgramModule { }
