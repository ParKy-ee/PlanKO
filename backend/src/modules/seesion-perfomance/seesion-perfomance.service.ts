import { Injectable } from '@nestjs/common';
import { PerfomanceDto } from './dto/session-performance';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionPerfomance } from './entities/seesion-perfomance.entity';
import { Repository } from 'typeorm';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { SessionPerformanceQueryDto } from 'src/commons/dtos/session-performance-qurey.dto';
import { ResponseHelper } from 'src/commons/helpers/response.helper';

@Injectable()
export class SeesionPerfomanceService {

  constructor(@InjectRepository(SessionPerfomance) private readonly sessionPerfomanceRepository: Repository<SessionPerfomance>) { }

  async create(perfomanceDto: PerfomanceDto) {
    try {
      const { plank_session_id, total_score, ...rest } = perfomanceDto;

      const payload = this.sessionPerfomanceRepository.create({
        ...rest,
        score: total_score,
        completed: true,
        plankSession: plank_session_id ? { id: plank_session_id } : undefined,
        user: perfomanceDto.userId ? { id: perfomanceDto.userId } : undefined,
      });

      const performance = await this.sessionPerfomanceRepository.save(payload);

      return ResponseHelper.success(performance, 'Session performance created successfully');
    } catch (error) {
      return ResponseHelper.error('Invalid data provided (e.g. invalid plank_session_id)');
    }
  }

  async findAll(query: SessionPerformanceQueryDto) {
    try {
      const { data: performances, meta } = await QueryHelper.paginate(this.sessionPerfomanceRepository, query, {
        sortField: 'id',
        relations: ['plankSession', 'user'],
        searchableFields: ['plankSession.id', 'user.id'],
      });

      const mappedData = performances.map(perf => {
        const { plankSession, user, ...rest } = perf;
        return {
          ...rest,
          plankSession: plankSession ? { id: plankSession.id } : null,
          user: user ? { id: user.id } : null,
        };
      });

      return {
        data: mappedData,
        meta
      }
    } catch (error) {
      return ResponseHelper.error('Failed to fetch session performances');
    }
  }

  async findOne(id: number): Promise<SessionPerfomance | null> {
    if (isNaN(id)) {
      return null;
    }
    return this.sessionPerfomanceRepository.findOne({ where: { id } });
  }

  async update(id: number, perfomanceDto: PerfomanceDto) {
    if (isNaN(id)) {
      return ResponseHelper.error('Invalid id provided');
    }

    const sessionPerfomance = await this.findOne(id);
    if (!sessionPerfomance) {
      return ResponseHelper.error('Session performance not found');
    }

    const payload: any = {};

    // relation
    if (perfomanceDto.plank_session_id !== undefined) {
      payload.plankSession = { id: perfomanceDto.plank_session_id };
    }

    // other fields
    if (perfomanceDto.total_score !== undefined) payload.score = perfomanceDto.total_score;
    if (perfomanceDto.duration !== undefined) payload.duration = perfomanceDto.duration;
    if (perfomanceDto.accuracy_avg !== undefined) payload.accuracy_avg = perfomanceDto.accuracy_avg;
    if (perfomanceDto.perfect_count !== undefined) payload.perfect_count = perfomanceDto.perfect_count;
    if (perfomanceDto.good_count !== undefined) payload.good_count = perfomanceDto.good_count;
    if (perfomanceDto.bad_count !== undefined) payload.bad_count = perfomanceDto.bad_count;
    if (perfomanceDto.missed_count !== undefined) payload.missed_count = perfomanceDto.missed_count;
    if (perfomanceDto.kcal !== undefined) payload.kcal = perfomanceDto.kcal;


    try {
      await this.sessionPerfomanceRepository.update(id, payload);
      return ResponseHelper.success({ id }, 'Session performance updated successfully');
    } catch (error) {
      return ResponseHelper.error('Invalid data provided for update');
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      return ResponseHelper.error('Invalid id provided');
    }
    const sessionPerfomance = await this.findOne(id);
    if (!sessionPerfomance) {
      return ResponseHelper.error('Session performance not found');
    }

    try {
      await this.sessionPerfomanceRepository.delete(id);
      return ResponseHelper.success(null, 'Session performance deleted successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to delete session performance (Reference error)');
    }
  }
}
