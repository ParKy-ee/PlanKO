import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from '../../modules/mission/entities/mission.entity';
import { MissionByProgram } from '../../modules/mission-by-program/entities/mission-by-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mission, MissionByProgram])],
  controllers: [MissionController],
  providers: [MissionService],
})
export class MissionModule { }
