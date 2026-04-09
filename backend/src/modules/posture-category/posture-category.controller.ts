import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { PostureCategoryService } from './posture-category.service';
import { CreatePostureCategoryDto } from './dto/create-posture-category.dto';
import { UpdatePostureCategoryDto } from './dto/update-posture-category.dto';
import { BaseQueryDto } from 'src/commons/dtos/base-query.dto';


@Controller({
  path: 'posture-category',
  version: '1',
})
export class PostureCategoryController {
  constructor(private readonly postureCategoryService: PostureCategoryService) {}

  @Post()
  create(@Body() createPostureCategoryDto: CreatePostureCategoryDto) {
    return this.postureCategoryService.create(createPostureCategoryDto);
  }

  @Get()
  findAll(@Query() query: BaseQueryDto) {
    return this.postureCategoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postureCategoryService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostureCategoryDto: UpdatePostureCategoryDto) {
    return this.postureCategoryService.update(+id, updatePostureCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postureCategoryService.remove(+id);
  }
}
