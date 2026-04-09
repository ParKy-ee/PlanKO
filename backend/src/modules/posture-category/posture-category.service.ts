import { Injectable } from '@nestjs/common';
import { CreatePostureCategoryDto } from './dto/create-posture-category.dto';
import { UpdatePostureCategoryDto } from './dto/update-posture-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostureCategory } from './entities/posture-category.entity';
import { Repository } from 'typeorm';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { BaseQueryDto } from 'src/commons/dtos/base-query.dto';
import { ResponseHelper } from 'src/commons/helpers/response.helper';

@Injectable()
export class PostureCategoryService {
  constructor(
    @InjectRepository(PostureCategory)
    private postureCategoryRepository: Repository<PostureCategory>,
  ) { }

  async create(createPostureCategoryDto: CreatePostureCategoryDto) {
    const postureCategory = this.postureCategoryRepository.create(createPostureCategoryDto);
    try {
      await this.postureCategoryRepository.save(postureCategory);
      return ResponseHelper.success(postureCategory);
    } catch (error) {
      return { error: true, message: 'Failed to create posture category', data: null };
    }
  }

  async findAll(query: BaseQueryDto): Promise<{ data: PostureCategory[]; meta: { totalItems: number; itemCount: number; itemsPerPage: number; totalPages: number; currentPage: number; }; }> {
    const { data: postureCategories, meta } = await QueryHelper.paginate(this.postureCategoryRepository, query, {
      sortField: 'id',
      searchableFields: ['name', 'description'],
      relations: ['postures'],
    });

    return {
      data: postureCategories,
      meta,
    };
  }

  async findOne(id: number): Promise<PostureCategory | null> {
    if (isNaN(id)) {
      return null;
    }
    return this.postureCategoryRepository.findOne({ where: { id }, relations: ['postures'] });
  }

  async update(id: number, updatePostureCategoryDto: UpdatePostureCategoryDto) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const postureCategory = await this.findOne(id);
    if (!postureCategory) {
      return {
        error: true,
        message: 'Posture category not found',
        data: null,
      };
    }

    try {
      await this.postureCategoryRepository.update(id, updatePostureCategoryDto);
      return {
        message: 'Posture category updated successfully',
        data: { id },
      };
    } catch (error) {
      return {
        error: true,
        message: 'Invalid data provided for update',
        data: null,
      };
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const postureCategory = await this.findOne(id);
    if (!postureCategory) {
      return {
        error: true,
        message: 'Posture category not found',
        data: null,
      };
    }
    try {
      await this.postureCategoryRepository.delete(id);
      return {
        message: 'Posture category deleted successfully',
        data: null,
      };
    } catch (error) {
      return {
        error: true,
        message: 'Failed to delete posture category (Reference error)',
        data: null,
      };
    }
  }
}
