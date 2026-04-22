import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { SeesionPerfomanceService } from './seesion-perfomance.service';
import { PerfomanceDto } from './dto/session-performance';
import { SessionPerformanceQueryDto } from '../../commons/dtos/session-performance-qurey.dto';
import { ResponseHelper } from '../../commons/helpers/response.helper';

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
  findAll(@Query() query: SessionPerformanceQueryDto) {
    return this.seesionPerfomanceService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const performance = await this.seesionPerfomanceService.findOne(+id);
    if (!performance) {
      return ResponseHelper.error('Session performance not found');
    }
    return ResponseHelper.success(performance);
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
