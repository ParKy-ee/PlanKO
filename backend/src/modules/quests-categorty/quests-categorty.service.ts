import { Injectable } from '@nestjs/common';
import { CreateQuestsCategortyDto } from './dto/create-quests-categorty.dto';
import { UpdateQuestsCategortyDto } from './dto/update-quests-categorty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestsCategorty } from './entities/quests-categorty.entity';
import { Repository } from 'typeorm';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { QuestsCategortyQueryDto } from 'src/commons/dtos/quests-categoey-query.dto';

@Injectable()
export class QuestsCategortyService {
  constructor(
    @InjectRepository(QuestsCategorty)
    private questsCategortyRepository: Repository<QuestsCategorty>,
  ) { }

  async create(createQuestsCategortyDto: CreateQuestsCategortyDto) {
    const category = this.questsCategortyRepository.create(createQuestsCategortyDto);
    await this.questsCategortyRepository.save(category);
    return {
      message: 'Quests Category created successfully',
      data: category,
    };
  }

  async findAll(query: QuestsCategortyQueryDto) {
    const { data: categories, meta } = await QueryHelper.paginate(this.questsCategortyRepository, query, {
      sortField: 'id',
      searchableFields: ['name', 'description'],
    });

    return {
      data: categories,
      meta,
    };
  }

  async findOne(id: number) {
    return this.questsCategortyRepository.findOne({ where: { id } });
  }

  async update(id: number, updateQuestsCategortyDto: UpdateQuestsCategortyDto) {
    const category = await this.findOne(id);
    if (!category) {
      throw new Error('Quests Category not found');
    }

    await this.questsCategortyRepository.update(id, updateQuestsCategortyDto);

    return {
      message: 'Quests Category updated successfully',
      data: { id },
    };
  }

  async remove(id: number) {
    return this.questsCategortyRepository.delete(id);
  }
}
