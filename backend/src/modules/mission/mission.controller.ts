import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { MissionService } from './mission.service';
<<<<<<< HEAD
import { UserQueryDto } from 'src/commons/dtos/user-query.dto';
import { MissionUpdateDto } from './dto/misson-update.dto';
import { MissionCreateDto } from './dto/mission-create.dto';
=======
import { MissionDto } from './dto/mission.dto';
import { MissionUpdatesDto } from './dto/mission-update.dto';
>>>>>>> feat/quest
import { MissionQueryDto } from 'src/commons/dtos/mission-query.dto';


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
<<<<<<< HEAD
  update(@Param('id') id: string, @Body() missionDto: MissionUpdateDto) {
=======
  update(@Param('id') id: string, @Body() missionDto: MissionUpdatesDto) {
>>>>>>> feat/quest
    return this.missionService.update(+id, missionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.remove(+id);
  }
}
