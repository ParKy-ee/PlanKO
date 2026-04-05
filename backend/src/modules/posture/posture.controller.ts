import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostureService } from './posture.service';
import { PostureDto } from './dto/posture.dto';
import { UserQueryDto } from 'src/commons/dtos/user-query.dto';
import { PostureQueryDto } from 'src/commons/dtos/posture.dto';

@Controller({
  path: 'posture',
  version: '1',
})
export class PostureController {
  constructor(private readonly postureService: PostureService) { }

  @Post()
  create(@Body() createPostureDto: PostureDto) {
    return this.postureService.create(createPostureDto);
  }

  @Get()
  findAll(@Query() query: PostureQueryDto) {
    return this.postureService.findAll(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostureDto: PostureDto) {
    return this.postureService.update(+id, updatePostureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postureService.remove(+id);
  }
}
