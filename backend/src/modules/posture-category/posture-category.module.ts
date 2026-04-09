import { Module } from '@nestjs/common';
import { PostureCategoryService } from './posture-category.service';
import { PostureCategoryController } from './posture-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostureCategory } from './entities/posture-category.entity';
import { Posture } from '../posture/entities/posture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostureCategory, Posture])],
  controllers: [PostureCategoryController],
  providers: [PostureCategoryService],
})
export class PostureCategoryModule { }
