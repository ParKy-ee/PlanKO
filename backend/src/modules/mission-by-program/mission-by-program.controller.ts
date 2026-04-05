import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MissionByProgramService } from './mission-by-program.service';
import { MissionByProgramUpdateDto } from './dto/mission-by-program-update.dto';

@Controller({
  path: 'mission-by-program',
  version: '1',
})
export class MissionByProgramController {
  constructor(private readonly missionByProgramService: MissionByProgramService) { }

  @Get('')
  get() {
    return this.missionByProgramService.getMissionsByProgram();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateMissionByProgramDto: MissionByProgramUpdateDto) {
    return this.missionByProgramService.update(id, updateMissionByProgramDto);
  }
}