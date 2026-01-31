import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramQueryDto } from 'src/commons/dtos/program-qurey.dtos';
import { ProgramDto } from './dto/program';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) { }

  @Post()
  create(@Body() ProgramDto: ProgramDto) {
    return this.programService.create(ProgramDto);
  }

  @Get()
  findAll(@Query() query: ProgramQueryDto) {
    return this.programService.findAll(query);
  }


  @Put(':id')
  update(@Param('id') id: string, @Body() updateProgramDto: ProgramDto) {
    return this.programService.update(+id, updateProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programService.remove(+id);
  }
}
