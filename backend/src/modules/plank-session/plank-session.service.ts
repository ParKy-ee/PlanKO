import { BadRequestException, Injectable } from '@nestjs/common';
import { PlankSessionDto } from './dto/update-plank-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlankSession } from './entities/plank-session.entity';
import { Repository } from 'typeorm';
import { BasePlankSessionQueryDto } from 'src/commons/dtos/base-plank-session-query.dto';
import { QueryHelper } from 'src/commons/helpers/query.helper';

@Injectable()
export class PlankSessionService {

  constructor(
    @InjectRepository(PlankSession)
    private readonly plankSessionRepository: Repository<PlankSession>,
  ) { }

  create(createPlankSessionDto: PlankSessionDto) {

    if (createPlankSessionDto.end_time <= createPlankSessionDto.start_time) {
      throw new BadRequestException("End time must be greater than start time");
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

    return this.plankSessionRepository.save(plankSession);
  }

  async findAll(query: BasePlankSessionQueryDto) {
    const { data, meta } = await QueryHelper.paginate(this.plankSessionRepository, query, {
      sortField: 'created_at',
      searchableFields: ['mode', 'completed', 'total_score', 'duration', 'start_time', 'end_time', 'user'],
      relations: ['user'],

    });

    return { data, meta };
  }

  findOne(id: number) {
    return this.plankSessionRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: PlankSessionDto) {

    const session = await this.findOne(id);
    if (!session) {
      throw new BadRequestException('Plank session not found');
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

    return await this.plankSessionRepository.update(id, payload);
  }


  remove(id: number) {
    return this.plankSessionRepository.delete(id);
  }
}
