import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { QuestByUesrService } from './quest-by-uesr.service';
import { CreateQuestByUesrDto } from './dto/create-quest-by-uesr.dto';
import { UpdateQuestByUesrDto } from './dto/update-quest-by-uesr.dto';

@Controller({
  path: 'quest-by-uesr',
  version: '1',
})
export class QuestByUesrController {
  constructor(private readonly questByUesrService: QuestByUesrService) {}

  @Post()
  create(@Body() createQuestByUesrDto: CreateQuestByUesrDto) {
    return this.questByUesrService.create(createQuestByUesrDto);
  }

  @Get()
  findAll() {
    return this.questByUesrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.questByUesrService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateQuestByUesrDto: UpdateQuestByUesrDto) {
    return this.questByUesrService.update(id, updateQuestByUesrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.questByUesrService.remove(id);
  }
}
