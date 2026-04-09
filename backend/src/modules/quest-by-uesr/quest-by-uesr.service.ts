import { Injectable } from '@nestjs/common';
import { CreateQuestByUesrDto } from './dto/create-quest-by-uesr.dto';
import { UpdateQuestByUesrDto } from './dto/update-quest-by-uesr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestByUser } from './entities/quest-by-uesr.entity';

@Injectable()
export class QuestByUesrService {

  constructor(
    @InjectRepository(QuestByUser)
    private readonly questByUserRepository: Repository<QuestByUser>,
  ) { }

  async create(createQuestByUesrDto: CreateQuestByUesrDto) {
    try {
      const qbu = this.questByUserRepository.create({
        ...createQuestByUesrDto,
        user: { id: createQuestByUesrDto.user_id },
      });
      await this.questByUserRepository.save(qbu);
      return { message: 'Created successfully', data: qbu };
    } catch (error) {
      return { error: true, message: 'Failed to create', data: null };
    }
  }

  async findAll() {
    try {
      const result = await this.questByUserRepository.find({
        relations: ['user']
      });
      return { data: result };
    } catch (error) {
      return { error: true, message: 'Failed to retrieve', data: null };
    }
  }

  async findOne(id: number) {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return { error: true, message: 'Invalid id', data: null };
    }
    try {
      const result = await this.questByUserRepository.findOne({
        where: { id: parsedId },
        relations: ['user']
      });
      if (!result) {
        return { error: true, message: 'Record not found', data: null };
      }
      return { data: result };
    } catch (error) {
      return { error: true, message: 'Failed to retrieve', data: null };
    }
  }

  async update(id: number, updateQuestByUesrDto: UpdateQuestByUesrDto) {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return { error: true, message: 'Invalid id', data: null };
    }

    const exists = await this.questByUserRepository.findOne({ where: { id: parsedId } });
    if (!exists) {
      return { error: true, message: 'Record not found', data: null };
    }

    try {
      const updateData: any = { ...updateQuestByUesrDto };
      if (updateQuestByUesrDto.user_id) {
        updateData.user = { id: updateQuestByUesrDto.user_id };
        delete updateData.user_id;
      }

      await this.questByUserRepository.update(parsedId, updateData);
      return { message: 'Updated successfully', data: { id: parsedId } };
    } catch (error) {
      return { error: true, message: 'Failed to update', data: null };
    }
  }

  async remove(id: number) {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return { error: true, message: 'Invalid id', data: null };
    }
    try {
      await this.questByUserRepository.delete(parsedId);
      return { message: 'Deleted successfully', data: null };
    } catch (error) {
      return { error: true, message: 'Failed to delete', data: null };
    }
  }
}
