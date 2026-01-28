import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SeesionPerfomanceService } from './seesion-perfomance.service';
import { PerfomanceDto } from './dto/session-performance';

@Controller({
  path: 'session-performance',
  version: '1',
})
export class SeesionPerfomanceController {
  constructor(private readonly seesionPerfomanceService: SeesionPerfomanceService) { }

  @Post()
  create(@Body() perfomanceDto: PerfomanceDto) {
    return this.seesionPerfomanceService.create(perfomanceDto);
  }

  @Get()
  findAll() {
    return this.seesionPerfomanceService.findAll();
  }



  @Put(':id')
  update(@Param('id') id: string, @Body() perfomanceDto: PerfomanceDto) {
    return this.seesionPerfomanceService.update(+id, perfomanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seesionPerfomanceService.remove(+id);
  }
}
