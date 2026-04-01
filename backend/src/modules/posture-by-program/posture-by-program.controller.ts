import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PostureByProgramService } from './posture-by-program.service';
import { PostureByProgramDto } from './dto/posture-by-progrem.dto';

@Controller({
  path: 'posture-by-program',
  version: '1',
})
export class PostureByProgramController {
  constructor(private readonly postureByProgramService: PostureByProgramService) { }

  @Get()
  get() {
    return this.postureByProgramService.getPosturesByProgram();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: PostureByProgramDto) {
    return this.postureByProgramService.update(+id, updateDto);
  }
}
