import { Module } from '@nestjs/common';
import { MissionByProgramService } from './mission-by-program.service';
import { MissionByProgramController } from './mission-by-program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionByProgram } from './entities/mission-by-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MissionByProgram])],
  controllers: [MissionByProgramController],
  providers: [MissionByProgramService],
  exports: [MissionByProgramService],
})
export class MissionByProgramModule { }
