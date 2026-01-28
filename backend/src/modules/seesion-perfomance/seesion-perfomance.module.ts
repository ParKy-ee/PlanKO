import { Module } from '@nestjs/common';
import { SeesionPerfomanceService } from './seesion-perfomance.service';
import { SeesionPerfomanceController } from './seesion-perfomance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionPerfomance } from '../../modules/seesion-perfomance/entities/seesion-perfomance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionPerfomance])],
  controllers: [SeesionPerfomanceController],
  providers: [SeesionPerfomanceService],
})
export class SeesionPerfomanceModule { }
