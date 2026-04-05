import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { QuestsCategortyService } from './quests-categorty.service';
import { CreateQuestsCategortyDto } from './dto/create-quests-categorty.dto';
import { UpdateQuestsCategortyDto } from './dto/update-quests-categorty.dto';
import { BaseQueryDto } from 'src/commons/dtos/base-query.dto';
import { QuestsCategortyQueryDto } from 'src/commons/dtos/quests-categoey-query.dto';

@Controller({
  path: 'quests-categorty',
  version: '1',
})
export class QuestsCategortyController {
  constructor(private readonly questsCategortyService: QuestsCategortyService) { }

  @Post()
  create(@Body() createQuestsCategortyDto: CreateQuestsCategortyDto) {
    return this.questsCategortyService.create(createQuestsCategortyDto);
  }

  @Get()
  findAll(@Query() query: QuestsCategortyQueryDto) {
    return this.questsCategortyService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questsCategortyService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQuestsCategortyDto: UpdateQuestsCategortyDto) {
    return this.questsCategortyService.update(+id, updateQuestsCategortyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questsCategortyService.remove(+id);
  }
}
