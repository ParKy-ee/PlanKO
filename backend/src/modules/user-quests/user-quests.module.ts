import { Module } from '@nestjs/common';
import { UserQuestsService } from './user-quests.service';
import { UserQuestsController } from './user-quests.controller';

@Module({
  controllers: [UserQuestsController],
  providers: [UserQuestsService],
})
export class UserQuestsModule {}
