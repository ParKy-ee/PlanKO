import { Injectable } from '@nestjs/common';
import { CreateQuestCategoryDto } from './dto/create-quest-category.dto';
import { UpdateQuestCategoryDto } from './dto/update-quest-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestCategory } from './entities/quest-category.entity';
import { Repository } from 'typeorm';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { QuestCategoryDto } from 'src/commons/dtos/quest-category.dto';
import { ResponseHelper } from 'src/commons/helpers/response.helper';

@Injectable()
export class QuestCategoryService {
  constructor(
    @InjectRepository(QuestCategory)
    private questCategoryRepository: Repository<QuestCategory>,
  ) { }

  async create(createQuestCategoryDto: CreateQuestCategoryDto) {
    try {
      const category = this.questCategoryRepository.create(createQuestCategoryDto);
      await this.questCategoryRepository.save(category);
      return ResponseHelper.success(category, 'Quest Category created successfully');
    } catch (error) {
      return ResponseHelper.error('Invalid data provided (e.g., duplicate or constraint violation)');
    }
  }

  async findAll(query: QuestCategoryDto) {
    try {
      const { data: categories, meta } = await QueryHelper.paginate(this.questCategoryRepository, query, {
        sortField: 'id',
        searchableFields: ['name', 'description'],
      });
      return { data: categories, meta };
    } catch (error) {
      return ResponseHelper.error('Failed to fetch quest categories');
    }
  }

  async findOne(id: number): Promise<QuestCategory | null> {
    if (isNaN(id)) {
      return null;
    }
    return await this.questCategoryRepository.findOne({ where: { id } });
  }

  async update(id: number, updateQuestCategoryDto: UpdateQuestCategoryDto) {
    const category = await this.findOne(id);
    if (!category) {
      return ResponseHelper.error('Quest Category not found');
    }
    try {
      await this.questCategoryRepository.update(id, updateQuestCategoryDto);
      return ResponseHelper.success({ id }, 'Quest Category updated successfully');
    } catch (error) {
      return ResponseHelper.error('Invalid data provided for update');
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) {
      return ResponseHelper.error('Quest Category not found');
    }
    try {
      await this.questCategoryRepository.delete(id);
      return ResponseHelper.success(null, 'Quest Category deleted successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to delete quest category (Reference error)');
    }
  }
}
