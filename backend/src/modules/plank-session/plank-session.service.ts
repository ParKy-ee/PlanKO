import { Injectable } from '@nestjs/common';
import { PlankSessionDto } from './dto/plank-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlankSession } from './entities/plank-session.entity';
import { Repository } from 'typeorm';
import { PlankSessionQueryDto } from 'src/commons/dtos/plank-session-query.dto';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { PlankSessionUpdateDto } from './dto/plank-session-update.dto';

@Injectable()
export class PlankSessionService {

  constructor(
    @InjectRepository(PlankSession)
    private readonly plankSessionRepository: Repository<PlankSession>,
  ) { }

  async create(createPlankSessionDto: PlankSessionDto) {

    if (createPlankSessionDto.end_time <= createPlankSessionDto.start_time) {
      return { error: true, message: "End time must be greater than start time", data: null };
    }

    const plankSession = this.plankSessionRepository.create({
      mode: createPlankSessionDto.mode,
      start_time: new Date(createPlankSessionDto.start_time),
      end_time: new Date(createPlankSessionDto.end_time),
      duration: (createPlankSessionDto.end_time - createPlankSessionDto.start_time) / 1000,
      total_score: createPlankSessionDto.total_score,
      status: createPlankSessionDto.status,
      completed: createPlankSessionDto.completed,
      user: {
        id: createPlankSessionDto.user_id
      },
    });

    try {
      await this.plankSessionRepository.save(plankSession);
      return { message: 'Plank session created successfully', data: plankSession };
    } catch (error) {
      return { error: true, message: 'Invalid userId provided', data: null };
    }
  }

  async findAll(query: PlankSessionQueryDto) {
    const { data, meta } = await QueryHelper.paginate(this.plankSessionRepository, query, {
      sortField: 'created_at',
      searchableFields: ['mode', 'completed', 'total_score', 'duration', 'start_time', 'end_time', 'user', 'status'],
      relations: ['user'],

    });

    return { data, meta };
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      return null;
    }
    return this.plankSessionRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: PlankSessionDto) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const session = await this.findOne(id);
    if (!session) {
      return { error: true, message: 'Plank session not found', data: null };
    }

    const payload: any = {};

    // relation
    if (dto.user_id !== undefined) {
      payload.user = { id: dto.user_id };
    }

    // time
    if (dto.start_time !== undefined) {
      payload.start_time = new Date(dto.start_time * 1000);
    }

    if (dto.end_time !== undefined) {
      payload.end_time = new Date(dto.end_time * 1000);
    }

    // duration (only when both exist)
    if (
      dto.start_time !== undefined &&
      dto.end_time !== undefined
    ) {
      payload.duration = Math.floor(
        (dto.end_time - dto.start_time)
      );
    }

    // other fields
    if (dto.mode !== undefined) payload.mode = dto.mode;
    if (dto.total_score !== undefined)
      payload.total_score = dto.total_score;
    if (dto.completed !== undefined)
      payload.completed = dto.completed;
    if (dto.status !== undefined)
      payload.status = dto.status;

    try {
      await this.plankSessionRepository.update(id, payload);
      return { message: 'Plank session updated successfully', data: { id } };
    } catch (error) {
      return { error: true, message: 'Invalid data provided (e.g. invalid user_id)', data: null };
    }
  }


  async remove(id: number) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }
    const session = await this.findOne(id);
    if (!session) {
      return { error: true, message: 'Plank session not found', data: null };
    }

    try {
      await this.plankSessionRepository.delete(id);
      return { message: 'Plank session deleted successfully', data: null };
    } catch (error) {
      return { error: true, message: 'Failed to delete plank session (Reference error)', data: null };
    }
  }
}
