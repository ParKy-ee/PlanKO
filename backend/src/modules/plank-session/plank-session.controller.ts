import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { PlankSessionService } from './plank-session.service';
import { PlankSessionDto } from './dto/update-plank-session.dto';
import { BasePlankSessionQueryDto } from 'src/commons/dtos/base-plank-session-query.dto';

@Controller({
  path: 'plank-session',
  version: '1',
})
export class PlankSessionController {
  constructor(private readonly plankSessionService: PlankSessionService) { }

  @Post()
  create(@Body() createPlankSessionDto: PlankSessionDto) {
    return this.plankSessionService.create(createPlankSessionDto);
  }

  @Get()
  findAll(@Query() query: BasePlankSessionQueryDto) {
    return this.plankSessionService.findAll(query);
  }


  @Put(':id')
  update(@Param('id') id: string, @Body() updatePlankSessionDto: PlankSessionDto) {
    return this.plankSessionService.update(+id, updatePlankSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plankSessionService.remove(+id);
  }
}
