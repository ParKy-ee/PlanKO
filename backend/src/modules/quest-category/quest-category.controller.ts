import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { QuestCategoryService } from './quest-category.service';
import { CreateQuestCategoryDto } from './dto/create-quest-category.dto';
import { UpdateQuestCategoryDto } from './dto/update-quest-category.dto';
import { BaseQueryDto } from 'src/commons/dtos/base-query.dto';
import { QuestCategoryDto } from 'src/commons/dtos/quest-category.dto';
import { ResponseHelper } from 'src/commons/helpers/response.helper';

@Controller({
  path: 'quest-category',
  version: '1',
})
export class QuestCategoryController {
  constructor(private readonly questCategoryService: QuestCategoryService) { }

  @Post()
  create(@Body() createQuestCategoryDto: CreateQuestCategoryDto) {
    return this.questCategoryService.create(createQuestCategoryDto);
  }

  @Get()
  findAll(@Query() query: QuestCategoryDto) {
    return this.questCategoryService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.questCategoryService.findOne(+id);
    if (!category) {
      return ResponseHelper.error('Quest Category not found');
    }
    return ResponseHelper.success(category);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQuestCategoryDto: UpdateQuestCategoryDto) {
    return this.questCategoryService.update(+id, updateQuestCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questCategoryService.remove(+id);
  }
}
