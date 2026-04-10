import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ProgramPlanService } from './program-plan.service';
import { CreateProgramPlanDto } from './dto/create-program-plan.dto';
import { UpdateProgramPlanDto } from './dto/update-program-plan.dto';
import { ProgramPlanQueryDto } from 'src/commons/dtos/program-plan-query.dto';

@Controller({
  path: 'program-plan',
  version: '1',
})
export class ProgramPlanController {
  constructor(private readonly programPlanService: ProgramPlanService) { }

  @Post()
  create(@Body() createProgramPlanDto: CreateProgramPlanDto) {
    return this.programPlanService.create(createProgramPlanDto);
  }

  @Get()
  findAll(@Query() query: ProgramPlanQueryDto) {
    return this.programPlanService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programPlanService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProgramPlanDto: UpdateProgramPlanDto) {
    return this.programPlanService.update(+id, updateProgramPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programPlanService.remove(+id);
  }
}
