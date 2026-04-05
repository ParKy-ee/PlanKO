import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionDto } from './dto/mission.dto';
import { MissionUpdatesDto } from './dto/mission-update.dto';
import { MissionQueryDto } from 'src/commons/dtos/mission-query.dto';


@Controller({
  path: 'mission',
  version: '1',
})
export class MissionController {
  constructor(private readonly missionService: MissionService) { }

  @Post()
  create(@Body() missionDto: MissionDto) {
    return this.missionService.create(missionDto);
  }

  @Get()
  findAll(@Query() query: MissionQueryDto) {
    return this.missionService.findAll(query);
  }



  @Put(':id')
  update(@Param('id') id: string, @Body() missionDto: MissionUpdatesDto) {
    return this.missionService.update(+id, missionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.remove(+id);
  }
}
