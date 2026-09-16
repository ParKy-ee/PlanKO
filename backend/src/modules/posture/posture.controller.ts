import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { PostureService } from './posture.service';
import { PostureDto } from './dto/posture.dto';
import { UserQueryDto } from '../../commons/dtos/user-query.dto';
import { PostureQueryDto } from '../../commons/dtos/posture.dto';
import { PostureUpdateDto } from './dto/posture-update.dto';

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

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostureDto: PostureUpdateDto) {
    return this.postureService.update(+id, updatePostureDto as any);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postureService.remove(+id);
  }
}
