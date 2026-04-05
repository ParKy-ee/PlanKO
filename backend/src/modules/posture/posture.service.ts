import { Injectable } from '@nestjs/common';
import { PostureDto } from './dto/posture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posture } from './entities/posture.entity';
import { Repository } from 'typeorm';
import { UserQueryDto } from 'src/commons/dtos/user-query.dto';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { PostureQueryDto } from 'src/commons/dtos/posture.dto';

@Injectable()
export class PostureService {

  constructor(@InjectRepository(Posture) private readonly postureRepository: Repository<Posture>) { }

  async create(createPostureDto: PostureDto) {
    const posture = this.postureRepository.create(createPostureDto);

    try {
      await this.postureRepository.save(posture);
      return { message: 'Posture created successfully', data: posture };
    } catch (error) {
      return { error: true, message: 'Invalid data provided (e.g. Unique constraint violation)', data: null };
    }
  }

  async findAll(query: PostureQueryDto) {
    const { data: postures, meta } = await QueryHelper.paginate(this.postureRepository, query, {
      sortField: 'id',
      searchableFields: ['postureName', 'postureType', 'postureDescription', 'status'],
    });

    return {
      data: postures,
      meta,
    };
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      return null;
    }
    return await this.postureRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePostureDto: PostureDto) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const posture = await this.findOne(id);
    if (!posture) {
      return { error: true, message: 'Posture not found', data: null };
    }

    try {
      await this.postureRepository.update(id, updatePostureDto);
      return { message: 'Posture updated successfully', data: { id } };
    } catch (error) {
      return { error: true, message: 'Invalid data provided for update', data: null };
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const posture = await this.findOne(id);
    if (!posture) {
      return { error: true, message: 'Posture not found', data: null };
    }

    try {
      await this.postureRepository.delete(id);
      return { message: 'Posture deleted successfully', data: null };
    } catch (error) {
      return { error: true, message: 'Failed to delete posture (Reference error)', data: null };
    }
  }
}
