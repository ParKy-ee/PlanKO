import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionCreateDto } from './dto/mission-create.dto';
import { MissionUpdateDto } from './dto/mission-update.dto';
import { MissionQueryDto } from '../../commons/dtos/mission-query.dto';


@Controller({
  path: 'mission',
  version: '1',
})
export class MissionController {
  constructor(private readonly missionService: MissionService) { }

  @Post()
  create(@Body() missionDto: MissionCreateDto) {
    console.log(missionDto);
    return this.missionService.create(missionDto);
  }

  @Get()
  findAll(@Query() query: MissionQueryDto) {
    return this.missionService.findAll(query);
  }



  @Put(':id')
  update(@Param('id') id: string, @Body() missionDto: MissionUpdateDto) {
    return this.missionService.update(+id, missionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.remove(+id);
  }
}
