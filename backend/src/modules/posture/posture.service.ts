import { Injectable } from '@nestjs/common';
import { PostureDto } from './dto/posture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posture } from './entities/posture.entity';
import { Repository } from 'typeorm';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { PostureQueryDto } from 'src/commons/dtos/posture.dto';
import { ResponseHelper } from 'src/commons/helpers/response.helper';
import { PostureUpdateDto } from './dto/posture-update.dto';

@Injectable()
export class PostureService {

  constructor(@InjectRepository(Posture) private readonly postureRepository: Repository<Posture>) { }

  async create(createPostureDto: PostureDto) {
    const { postureCategory, ...rest } = createPostureDto;

    const posture = this.postureRepository.create({
      ...rest,
      postureCategory: { id: postureCategory } as any
    });

    try {
      await this.postureRepository.save(posture);
      return ResponseHelper.success(posture, 'Posture created successfully');
    } catch (error) {
      return ResponseHelper.error('Invalid data provided (e.g. Unique constraint violation or missing required fields)');
    }
  }

  async findAll(query: PostureQueryDto) {
    const { data: postures, meta } = await QueryHelper.paginate(this.postureRepository, query, {
      sortField: 'id',
      searchableFields: ['name', 'description'],
      relations: ['postureCategory'],
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
    return await this.postureRepository.findOne({ where: { id }, relations: ['postureCategory'] });
  }

  async update(id: number, updatePostureDto: PostureUpdateDto) {
    if (isNaN(id)) {
      return ResponseHelper.error('Invalid id provided');
    }

    const posture = await this.findOne(id);
    if (!posture) {
      return ResponseHelper.error('Posture not found');
    }

    const { postureCategory, ...rest } = updatePostureDto;

    const updateData: any = { ...rest };
    if (postureCategory !== undefined) {
      updateData.postureCategory = { id: postureCategory };
    }

    try {
      await this.postureRepository.update(id, updateData);
      return ResponseHelper.success({ id }, 'Posture updated successfully');
    } catch (error) {
      return ResponseHelper.error('Invalid data provided for update');
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      return ResponseHelper.error('Invalid id provided');
    }

    const posture = await this.findOne(id);
    if (!posture) {
      return ResponseHelper.error('Posture not found');
    }

    try {
      await this.postureRepository.delete(id);
      return ResponseHelper.success(null, 'Posture deleted successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to delete posture (Reference error)');
    }
  }
}
