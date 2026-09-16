import { Injectable } from '@nestjs/common';
import { CreatePlankBySessionDto } from './dto/create-plank-by-session.dto';
import { UpdatePlankBySessionDto } from './dto/update-plank-by-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlankBySession } from './entities/plank-by-session.entity';
import { Repository } from 'typeorm';
import { ResponseHelper } from '../../commons/helpers/response.helper';
import { PlankBySessionQueryDto } from '../../commons/dtos/plank-by-session-query.dto';
import { QueryHelper } from '../../commons/helpers/query.helper';

@Injectable()
export class PlankBySessionService {
  constructor(
    @InjectRepository(PlankBySession)
    private readonly plankBySessionRepository: Repository<PlankBySession>,
  ) { }

  async create(createPlankBySessionDto: CreatePlankBySessionDto) {
    const { plankSessionId, postureId, ...rest } = createPlankBySessionDto;

    const plankBySession = this.plankBySessionRepository.create({
      ...rest,
      plankSession: { id: plankSessionId },
      posture: { id: postureId },
    });

    try {
      await this.plankBySessionRepository.save(plankBySession);
      return ResponseHelper.success(plankBySession, 'Plank by session created successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to create plank by session (Invalid plankSessionId or postureId)');
    }
  }

  async findAll(query: PlankBySessionQueryDto) {
    const where: any = {};
    const queryObj: any = { ...query };

    if (query.plankSessionId) {
      where.plankSession = { id: query.plankSessionId };
    }
    if (query.postureId) {
      where.posture = { id: query.postureId };
    }

    const { data, meta } = await QueryHelper.paginate(this.plankBySessionRepository, queryObj, {
      sortField: 'order',
      searchableFields: ['plankSession.name', 'posture.name'],
      relations: ['plankSession', 'posture'],
      where,
    });

    return { data, meta };
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      return null;
    }
    return this.plankBySessionRepository.findOne({
      where: { id },
      relations: ['plankSession', 'posture'],
    });
  }

  async update(id: number, updatePlankBySessionDto: UpdatePlankBySessionDto) {
    if (isNaN(id)) {
      return ResponseHelper.error('Invalid id provided');
    }

    const existing = await this.findOne(id);
    if (!existing) {
      return ResponseHelper.error('Plank by session not found');
    }

    const { plankSessionId, postureId, ...rest } = updatePlankBySessionDto;
    const updatePayload: any = { ...rest };

    if (plankSessionId !== undefined) {
      updatePayload.plankSession = { id: plankSessionId };
    }
    if (postureId !== undefined) {
      updatePayload.posture = { id: postureId };
    }

    try {
      await this.plankBySessionRepository.update(id, updatePayload);
      return ResponseHelper.success({ id }, 'Plank by session updated successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to update plank by session');
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      return ResponseHelper.error('Invalid id provided');
    }

    const existing = await this.findOne(id);
    if (!existing) {
      return ResponseHelper.error('Plank by session not found');
    }

    try {
      await this.plankBySessionRepository.delete(id);
      return ResponseHelper.success(null, 'Plank by session deleted successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to delete plank by session');
    }
  }
}
