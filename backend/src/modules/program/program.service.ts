import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { Repository } from 'typeorm';
import { ProgramDto } from './dto/program';
import { ProgramQueryDto } from 'src/commons/dtos/program-qurey.dtos';
import { QueryHelper } from 'src/commons/helpers/query.helper';

@Injectable()
export class ProgramService {

  constructor(@InjectRepository(Program) private readonly programRepository: Repository<Program>) { }

  create(createProgramDto: ProgramDto) {
    return this.programRepository.save(createProgramDto);
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
    return this.programRepository.update(id, updateProgramDto);
  }

  remove(id: number) {
    return this.programRepository.delete(id);
  }
}
