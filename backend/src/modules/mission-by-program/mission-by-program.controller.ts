import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MissionByProgramService } from './mission-by-program.service';
import { MissionByProgramUpdateDto } from './dto/mission-by-program-update.dto';
import { MissionByProgramDto } from './dto/mission-by-program.dto';

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

  @Post('')
  create(@Body() missionByProgramDto: MissionByProgramDto) {
    return this.missionByProgramService.addMissionToProgram(missionByProgramDto.programId, missionByProgramDto.missionId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateMissionByProgramDto: MissionByProgramUpdateDto) {
    return this.missionByProgramService.update(id, updateMissionByProgramDto);
  }

  @Delete(':programId/:missionId')
  remove(@Param('programId') programId: number, @Param('missionId') missionId: number) {
    return this.missionByProgramService.removeMissionFromProgram(programId, missionId);
  }
}