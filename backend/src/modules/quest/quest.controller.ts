import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { QuestService } from './quest.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { QuestDto } from '../../commons/dtos/quest.dto';

@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) { }

  @Post()
  create(@Body() createQuestDto: CreateQuestDto) {
    return this.questService.create(createQuestDto);
  }

  @Get()
  findAll(@Query() query: QuestDto) {
    return this.questService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQuestDto: UpdateQuestDto) {
    return this.questService.update(+id, updateQuestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questService.remove(+id);
  }
}
