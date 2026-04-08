import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QuestByUser } from '../quest-by-uesr/entities/quest-by-uesr.entity';
import { Quest } from '../quest/entities/quest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, QuestByUser, Quest])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
