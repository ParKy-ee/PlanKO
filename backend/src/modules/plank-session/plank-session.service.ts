import { Injectable } from '@nestjs/common';
import { PlankSessionDto } from './dto/plank-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlankSession } from './entities/plank-session.entity';
import { Repository } from 'typeorm';
import { PlankSessionQueryDto } from '../../commons/dtos/plank-session-query.dto';
import { QueryHelper } from '../../commons/helpers/query.helper';
import { PlankSessionUpdateDto } from './dto/plank-session-update.dto';
import { ResponseHelper } from '../../commons/helpers/response.helper';

@Injectable()
export class PlankSessionService {
  constructor(
    @InjectRepository(PlankSession)
    private readonly plankSessionRepository: Repository<PlankSession>,
  ) { }

  async create(createPlankSessionDto: PlankSessionDto) {
    const plankSession = this.plankSessionRepository.create(createPlankSessionDto);

    try {
      await this.plankSessionRepository.save(plankSession);
      return ResponseHelper.success(plankSession);
    } catch (error) {
      return ResponseHelper.error('Invalid data provided or failed to create plank session');
    }
  }

  async findAll(query: PlankSessionQueryDto) {
    const where: any = {};
    const queryObj: any = { ...query };

    const { data, meta } = await QueryHelper.paginate(this.plankSessionRepository, queryObj, {
      sortField: 'created_at',
      searchableFields: ['name', 'description'],
      where: where,
    });

    return { data, meta };
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      return null;
    }
    return this.plankSessionRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: PlankSessionUpdateDto) {
    if (isNaN(id)) {
      return ResponseHelper.error('Invalid id provided');
    }

    const session = await this.findOne(id);
    if (!session) {
      return ResponseHelper.error('Plank session not found');
    }

    try {
      await this.plankSessionRepository.update(id, dto);
      return ResponseHelper.success({ id }, 'Plank session updated successfully');
    } catch (error) {
      return ResponseHelper.error('Invalid data provided for update');
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      return ResponseHelper.error('Invalid id provided');
    }

    const session = await this.findOne(id);
    if (!session) {
      return ResponseHelper.error('Plank session not found');
    }

    try {
      await this.plankSessionRepository.delete(id);
      return ResponseHelper.success(null, 'Plank session deleted successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to delete plank session (Reference error)');
    }
  }
}
