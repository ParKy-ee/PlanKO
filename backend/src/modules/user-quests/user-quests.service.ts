import { Injectable } from '@nestjs/common';
import { CreateUserQuestDto } from './dto/create-user-quest.dto';
import { UpdateUserQuestDto } from './dto/update-user-quest.dto';

@Injectable()
export class UserQuestsService {
  create(createUserQuestDto: CreateUserQuestDto) {
    return 'This action adds a new userQuest';
  }

  findAll() {
    return `This action returns all userQuests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userQuest`;
  }

  update(id: number, updateUserQuestDto: UpdateUserQuestDto) {
    return `This action updates a #${id} userQuest`;
  }

  remove(id: number) {
    return `This action removes a #${id} userQuest`;
  }
}
