import { Injectable } from '@nestjs/common';

import { PerfomanceDto } from './dto/session-performance';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionPerfomance } from './entities/seesion-perfomance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeesionPerfomanceService {

  constructor(@InjectRepository(SessionPerfomance) private readonly sessionPerfomanceRepository: Repository<SessionPerfomance>) { }

  async create(perfomanceDto: PerfomanceDto) {
    try {
      const performance = await this.sessionPerfomanceRepository.save({
        plankSession: {
          id: perfomanceDto.plank_session_id
        },
        ...perfomanceDto
      });
      return { message: 'Session performance created successfully', data: performance };
    } catch (error) {
      return { error: true, message: 'Invalid data provided (e.g. invalid plank_session_id)', data: null };
    }
  }

  async findAll() {
    return this.sessionPerfomanceRepository.find();
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      return null;
    }
    return this.sessionPerfomanceRepository.findOne({ where: { id } });
  }

  async update(id: number, perfomanceDto: PerfomanceDto) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const sessionPerfomance = await this.findOne(id);
    if (!sessionPerfomance) {
      return { error: true, message: 'Session performance not found', data: null };
    }

    const payload: any = {};

    // relation
    if (perfomanceDto.plank_session_id !== undefined) {
      payload.plankSession = { id: perfomanceDto.plank_session_id };
    }

    // other fields
    if (perfomanceDto.total_score !== undefined) payload.total_score = perfomanceDto.total_score;
    if (perfomanceDto.duration !== undefined) payload.duration = perfomanceDto.duration;
    if (perfomanceDto.accuracy_avg !== undefined) payload.accuracy_avg = perfomanceDto.accuracy_avg;
    if (perfomanceDto.perfect_count !== undefined) payload.perfect_count = perfomanceDto.perfect_count;
    if (perfomanceDto.good_count !== undefined) payload.good_count = perfomanceDto.good_count;
    if (perfomanceDto.bad_count !== undefined) payload.bad_count = perfomanceDto.bad_count;
    if (perfomanceDto.missed_count !== undefined) payload.missed_count = perfomanceDto.missed_count;
    if (perfomanceDto.figure_count !== undefined) payload.figure_count = perfomanceDto.figure_count;

    try {
      await this.sessionPerfomanceRepository.update(id, payload);
      return { message: 'Session performance updated successfully', data: { id } };
    } catch (error) {
       return { error: true, message: 'Invalid data provided for update', data: null };
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }
    const sessionPerfomance = await this.findOne(id);
    if (!sessionPerfomance) {
      return { error: true, message: 'Session performance not found', data: null };
    }

    try {
      await this.sessionPerfomanceRepository.delete(id);
      return { message: 'Session performance deleted successfully', data: null };
    } catch (error) {
      return { error: true, message: 'Failed to delete session performance (Reference error)', data: null };
    }
  }
}
