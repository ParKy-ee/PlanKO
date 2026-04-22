import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { PlankSessionService } from './plank-session.service';
import { PlankSessionDto } from './dto/plank-session.dto';
import { PlankSessionQueryDto } from '../../commons/dtos/plank-session-query.dto';
import { PlankSessionUpdateDto } from './dto/plank-session-update.dto';

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
  findAll(@Query() query: PlankSessionQueryDto) {
    return this.plankSessionService.findAll(query);
  }


  @Put(':id')
  update(@Param('id') id: string, @Body() updatePlankSessionDto: PlankSessionUpdateDto) {
    return this.plankSessionService.update(+id, updatePlankSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plankSessionService.remove(+id);
  }
}
