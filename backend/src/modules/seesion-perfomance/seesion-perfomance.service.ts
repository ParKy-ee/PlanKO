import { BadRequestException, Injectable } from '@nestjs/common';

import { PerfomanceDto } from './dto/session-performance';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionPerfomance } from './entities/seesion-perfomance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeesionPerfomanceService {

  constructor(@InjectRepository(SessionPerfomance) private readonly sessionPerfomanceRepository: Repository<SessionPerfomance>) { }

  create(perfomanceDto: PerfomanceDto) {


    return this.sessionPerfomanceRepository.save({
      plankSession: {
        id: perfomanceDto.plank_session_id
      },
      ...perfomanceDto
    });
  }

  findAll() {
    return this.sessionPerfomanceRepository.find();
  }

  findOne(id: number) {
    return this.sessionPerfomanceRepository.findOne({ where: { id } });
  }

  async update(id: number, perfomanceDto: PerfomanceDto) {


    const sessionPerfomance = await this.findOne(id);
    if (!sessionPerfomance) {
      throw new BadRequestException('Session performance not found');
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

    return this.sessionPerfomanceRepository.update(id, payload);
  }

  remove(id: number) {
    return this.sessionPerfomanceRepository.delete(id);
  }
}
