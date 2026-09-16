import { Injectable } from '@nestjs/common';
import { PostureByProgramDto } from './dto/posture-by-progrem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostureByProgram } from './entities/posture-by-program.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostureByProgramService {
  constructor(
    @InjectRepository(PostureByProgram)
    private readonly postureByProgramRepository: Repository<PostureByProgram>,
  ) { }

  async addPostureToProgram(createDto: PostureByProgramDto) {
    const { programId, postureId } = createDto;

    if (isNaN(programId) || isNaN(postureId)) {
      return { error: true, message: 'Invalid programId or postureId', data: null };
    }

    const postureByProgram = this.postureByProgramRepository.create({
      program: { id: programId },
      posture: { id: postureId },
    });

    try {
      await this.postureByProgramRepository.save(postureByProgram);
      return { message: 'Posture linked to program successfully', data: postureByProgram };
    } catch (error) {
      return { error: true, message: 'Invalid programId or postureId provided', data: null };
    }
  }

  async getPosturesByProgram() {
    return this.postureByProgramRepository.find({
      relations: ['program', 'posture'],
    });
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      return null;
    }
    return this.postureByProgramRepository.findOne({ where: { id }, relations: ['program', 'posture'] });
  }

  async update(id: number, updateDto: PostureByProgramDto) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const existing = await this.findOne(id);
    if (!existing) {
      return { error: true, message: 'Record not found', data: null };
    }

    const { programId, postureId, ...rest } = updateDto;
    const updateData: any = { ...rest };
    if (programId !== undefined && !isNaN(programId)) updateData.program = { id: programId };
    if (postureId !== undefined && !isNaN(postureId)) updateData.posture = { id: postureId };

    try {
      await this.postureByProgramRepository.update(id, updateData);
      return { message: 'Updated successfully', data: { id } };
    } catch (error) {
      return { error: true, message: 'Invalid programId or postureId provided', data: null };
    }
  }

  async removePostureFromProgram(id: number) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const existing = await this.findOne(id);
    if (!existing) {
      return { error: true, message: 'Record not found', data: null };
    }

    try {
      await this.postureByProgramRepository.delete(id);
      return { message: 'Removed successfully', data: null };
    } catch (error) {
      return { error: true, message: 'Failed to remove posture from program (Reference error)', data: null };
    }
  }
}
