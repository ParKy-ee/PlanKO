import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { Repository } from 'typeorm';
import { ProgramDto } from './dto/program';
import { ProgramQueryDto } from 'src/commons/dtos/program-qurey.dtos';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { PostureByProgram } from '../posture-by-program/entities/posture-by-program.entity';

@Injectable()
export class ProgramService {

  constructor(@InjectRepository(Program) private readonly programRepository: Repository<Program>,
    @InjectRepository(PostureByProgram) private readonly postureByProgramRepository: Repository<PostureByProgram>) { }

  async create(createProgramDto: ProgramDto): Promise<Program> {
    const program = await this.programRepository.create({
      programName: createProgramDto.programName,
      programType: createProgramDto.programType,
      period: createProgramDto.period,
      frequency: createProgramDto.frequency,
      workDays: createProgramDto.workDays,
      restDays: createProgramDto.restDays,
      status: createProgramDto.status,
      rest: createProgramDto.rest,
    });
    await this.programRepository.save(program);
    const postureByProgram = await this.postureByProgramRepository.create({
      postureId: createProgramDto.postureId,
      programId: program.id,
    });
    await this.postureByProgramRepository.save(postureByProgram);
    return program;
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


  update(id: number, updateProgramDto: ProgramDto) {
    return this.programRepository.update(id, { ...updateProgramDto, status: true });
  }

  remove(id: number) {
    return this.programRepository.delete(id);
  }
}
