import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserQuestsService } from './user-quests.service';
import { CreateUserQuestDto } from './dto/create-user-quest.dto';
import { UpdateUserQuestDto } from './dto/update-user-quest.dto';

@Controller('user-quests')
export class UserQuestsController {
  constructor(private readonly userQuestsService: UserQuestsService) {}

  @Post()
  create(@Body() createUserQuestDto: CreateUserQuestDto) {
    return this.userQuestsService.create(createUserQuestDto);
  }

  @Get()
  findAll() {
    return this.userQuestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userQuestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserQuestDto: UpdateUserQuestDto) {
    return this.userQuestsService.update(+id, updateUserQuestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userQuestsService.remove(+id);
  }
}
