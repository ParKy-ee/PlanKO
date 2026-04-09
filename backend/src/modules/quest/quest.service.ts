import { Injectable } from '@nestjs/common';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from './entities/quest.entity';
import { Repository } from 'typeorm';
import { BaseQueryDto } from 'src/commons/dtos/base-query.dto';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { QuestDto } from 'src/commons/dtos/quest.dto';
import { ResponseHelper } from 'src/commons/helpers/response.helper';

@Injectable()
export class QuestService {
  constructor(
    @InjectRepository(Quest)
    private questRepository: Repository<Quest>,
  ) { }

  async create(createQuestDto: CreateQuestDto) {
    const { quest_category_id, ...rest } = createQuestDto;
    const quest = this.questRepository.create({
      ...rest,
      questCategory: { id: quest_category_id },
    });
    try {
      await this.questRepository.save(quest);
      return ResponseHelper.success(quest, 'Quest created successfully');
    } catch (error) {
      return ResponseHelper.error('Invalid data provided (e.g., duplicate or constraint violation)');
    }
  }

  async findAll(query: QuestDto) {
    try {
      const { data: quests, meta } = await QueryHelper.paginate(this.questRepository, query, {
        sortField: 'id',
        searchableFields: ['name', 'quest_type', 'difficulty', 'description'],
      });
      return ResponseHelper.success(quests, 'Quests fetched successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to fetch quests', null);
    }
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      return ResponseHelper.error('Invalid id provided', null);
    }
    const quest = await this.questRepository.findOne({ where: { id } });
    if (!quest) {
      return ResponseHelper.error('Quest not found', null);
    }
    return quest;
  }

  async update(id: number, updateQuestDto: UpdateQuestDto) {
    const existing = await this.findOne(id);
    if (existing && (existing as any).error) {
      return existing;
    }
    if (!existing) {
      return ResponseHelper.error('Quest not found', null);
    }
    try {
      await this.questRepository.update(id, updateQuestDto);
      return ResponseHelper.success({ id }, 'Quest updated successfully');
    } catch (error) {
      return ResponseHelper.error('Invalid data provided for update', null);
    }
  }

  async remove(id: number) {
    try {

      const result = await this.questRepository.delete(id);
      if (result.affected === 0) {
        return ResponseHelper.error('Quest not found');
      }

      return ResponseHelper.success(null, 'Quest deleted successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to delete quest (Reference error)');
    }
  }
}
