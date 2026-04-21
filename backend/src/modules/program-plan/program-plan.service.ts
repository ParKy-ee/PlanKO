import { Injectable } from '@nestjs/common';
import { CreateProgramPlanDto } from './dto/create-program-plan.dto';
import { UpdateProgramPlanDto } from './dto/update-program-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramPlan } from './entities/program-plan.entity';
import { Repository } from 'typeorm';
import { ResponseHelper } from 'src/commons/helpers/response.helper';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { ProgramPlanQueryDto } from 'src/commons/dtos/program-plan-query.dto';

@Injectable()
export class ProgramPlanService {
  constructor(
    @InjectRepository(ProgramPlan)
    private readonly programPlanRepository: Repository<ProgramPlan>,
  ) { }

  async create(createProgramPlanDto: CreateProgramPlanDto) {
    const { program_id, plank_session_id, ...rest } = createProgramPlanDto;

    const programPlan = this.programPlanRepository.create({
      ...rest,
      program: { id: program_id },
      plankSession: { id: plank_session_id },
    });

    try {
      await this.programPlanRepository.save(programPlan);
      return ResponseHelper.success(programPlan, 'Program plan created successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to create program plan. Ensure program and session exist.');
    }
  }

  async findAll(query: ProgramPlanQueryDto) {
    const where: any = {};
    const queryObj: any = { ...query };

    if (queryObj.programId) {
      where.program = { id: queryObj.programId };
    }
    if (queryObj.plankSessionId) {
      where.plankSession = { id: queryObj.plankSessionId };
    }

    const { data: programPlans, meta } = await QueryHelper.paginate(this.programPlanRepository, queryObj, {
      sortField: 'order',
      searchableFields: ['is_active'],
      relations: ['program', 'plankSession'],
      where: where,
    });

    return {
      data: programPlans,
      meta,
    };
  }

  async findOne(id: number) {
    if (isNaN(id)) return null;
    return await this.programPlanRepository.findOne({
      where: { id },
      relations: ['program', 'plankSession'],
    });
  }

  async update(id: number, updateProgramPlanDto: UpdateProgramPlanDto) {
    if (isNaN(id)) return ResponseHelper.error('Invalid id provided');

    const programPlan = await this.findOne(id);
    if (!programPlan) return ResponseHelper.error('Program plan not found');

    const { program_id, plank_session_id, ...rest } = updateProgramPlanDto;
    const updateData: any = { ...rest };

    if (program_id !== undefined) {
      updateData.program = { id: program_id };
    }
    if (plank_session_id !== undefined) {
      updateData.plankSession = { id: plank_session_id };
    }

    try {
      await this.programPlanRepository.update(id, updateData);
      return ResponseHelper.success({ id }, 'Program plan updated successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to update program plan');
    }
  }

  async remove(id: number) {
    if (isNaN(id)) return ResponseHelper.error('Invalid id provided');

    const programPlan = await this.findOne(id);
    if (!programPlan) return ResponseHelper.error('Program plan not found');

    try {
      await this.programPlanRepository.delete(id);
      return ResponseHelper.success(null, 'Program plan deleted successfully');
    } catch (error) {
      return ResponseHelper.error('Failed to delete program plan (Reference error)');
    }
  }
}
