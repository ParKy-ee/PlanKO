import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeDashboardService } from './home-dashboard.service';
import { HomeDashboardController } from './home-dashboard.controller';
import { SessionPerfomance } from '../seesion-perfomance/entities/seesion-perfomance.entity';
import { PostureCategory } from '../posture-category/entities/posture-category.entity';
import { Posture } from '../posture/entities/posture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionPerfomance, PostureCategory, Posture])],
  controllers: [HomeDashboardController],
  providers: [HomeDashboardService],
})
export class HomeDashboardModule {}
