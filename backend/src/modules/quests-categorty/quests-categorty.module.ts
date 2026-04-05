import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestsCategortyService } from './quests-categorty.service';
import { QuestsCategortyController } from './quests-categorty.controller';
import { QuestsCategorty } from './entities/quests-categorty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestsCategorty])],
  controllers: [QuestsCategortyController],
  providers: [QuestsCategortyService],
})
export class QuestsCategortyModule {}
