import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { Repository } from 'typeorm';
import { ProgramDto } from './dto/program';
import { ProgramQueryDto } from '../../commons/dtos/program-qurey.dtos';
import { QueryHelper } from '../../commons/helpers/query.helper';
import { PostureByProgram } from '../posture-by-program/entities/posture-by-program.entity';

@Injectable()
export class ProgramService {

  constructor(@InjectRepository(Program) private readonly programRepository: Repository<Program>,
    @InjectRepository(PostureByProgram) private readonly postureByProgramRepository: Repository<PostureByProgram>) { }

  async create(createProgramDto: ProgramDto) {
    const program = await this.programRepository.create({
      programName: createProgramDto.programName,
      programType: createProgramDto.programType,
      period: createProgramDto.period,
      frequency: createProgramDto.frequency,
      workDays: createProgramDto.workDays,
      restDays: createProgramDto.restDays,
    });

    try {
      await this.programRepository.save(program);
    } catch (error) {
      return { error: true, message: 'Invalid data provided for program', data: null };
    }
    return { message: 'Program created successfully', data: program };
  }

  async findAll(query: ProgramQueryDto): Promise<{ data: Program[], meta: any }> {
    const { data: missions, meta } = await QueryHelper.paginate(this.programRepository, query, {
      sortField: 'id',
      searchableFields: ['programName', 'programType', 'period', 'frequency', 'workDays', 'restDays', 'status', 'missionByPrograms'],
    });

    return {
      data: missions,
      meta: meta,
    }
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      return null;
    }
    return this.programRepository.findOne({ where: { id } });
  }

  async update(id: number, updateProgramDto: ProgramDto) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const program = await this.findOne(id);
    if (!program) {
      return { error: true, message: 'Program not found', data: null };
    }

    try {
      await this.programRepository.update(id, { ...updateProgramDto });
      return { message: 'Program updated successfully', data: { id } };
    } catch (error) {
      return { error: true, message: 'Invalid data provided for update', data: null };
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const program = await this.findOne(id);
    if (!program) {
      return { error: true, message: 'Program not found', data: null };
    }

    try {
      await this.programRepository.delete(id);
      return { message: 'Program deleted successfully', data: null };
    } catch (error) {
      return { error: true, message: 'Failed to delete program (Reference error)', data: null };
    }
  }
}
