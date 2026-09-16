import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestCategoryService } from './quest-category.service';
import { QuestCategoryController } from './quest-category.controller';
import { QuestCategory } from './entities/quest-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestCategory])],
  controllers: [QuestCategoryController],
  providers: [QuestCategoryService],
})
export class QuestCategoryModule {}
