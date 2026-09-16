import { Module } from '@nestjs/common';
import { UserQuestsService } from './user-quests.service';
import { UserQuestsController } from './user-quests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuest } from './entities/user-quest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserQuest])],
  controllers: [UserQuestsController],
  providers: [UserQuestsService],
})
export class UserQuestsModule { }
