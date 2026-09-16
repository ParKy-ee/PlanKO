import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { PlankBySessionService } from './plank-by-session.service';
import { CreatePlankBySessionDto } from './dto/create-plank-by-session.dto';
import { UpdatePlankBySessionDto } from './dto/update-plank-by-session.dto';
import { PlankBySessionQueryDto } from '../../commons/dtos/plank-by-session-query.dto';

@Controller({
  path: 'plank-by-session',
  version: '1',
})
export class PlankBySessionController {
  constructor(private readonly plankBySessionService: PlankBySessionService) { }

  @Post()
  create(@Body() createPlankBySessionDto: CreatePlankBySessionDto) {
    return this.plankBySessionService.create(createPlankBySessionDto);
  }

  @Get()
  findAll(@Query() query: PlankBySessionQueryDto) {
    return this.plankBySessionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plankBySessionService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePlankBySessionDto: UpdatePlankBySessionDto) {
    return this.plankBySessionService.update(+id, updatePlankBySessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plankBySessionService.remove(+id);
  }
}
