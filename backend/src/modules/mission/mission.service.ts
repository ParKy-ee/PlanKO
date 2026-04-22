import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from '../../modules/mission/entities/mission.entity';
import { Repository } from 'typeorm';
import { QueryHelper } from '../../commons/helpers/query.helper';
import { MissionByProgram } from '../../modules/mission-by-program/entities/mission-by-program.entity';
import { ProgramPlan } from '../../modules/program-plan/entities/program-plan.entity';
import { Program } from '../../modules/program/entities/program.entity';
import { MissionCreateDto } from './dto/mission-create.dto';
import { MissionUpdateDto } from './dto/mission-update.dto';
import { MissionQueryDto } from '../../commons/dtos/mission-query.dto';
import { ResponseHelper } from '../../commons/helpers/response.helper';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(MissionByProgram)
    private missionByProgramRepository: Repository<MissionByProgram>,
    @InjectRepository(ProgramPlan)
    private programPlanRepository: Repository<ProgramPlan>,
  ) { }

  async create(missionDto: MissionCreateDto) {
    const { userId, ...rest } = missionDto;

    // Fetch the program to calculate total plank sessions using period * frequency
    const program = await this.missionRepository.manager.findOne(Program, {
      where: { id: missionDto.missionByProgramId },
    });

    const targetSessionCount = program ? (program.period * program.frequency) : 0;

    const mission = this.missionRepository.create({
      ...rest,
      target: targetSessionCount,
      current: 0,
      user: { id: Number(userId) },
    });

    try {
      await this.missionRepository.save(mission);
    } catch (error) {
      return ResponseHelper.error("Invalid userId provided");
    }

    const missionByProgram = this.missionByProgramRepository.create({
      program: { id: missionDto.missionByProgramId },
      mission: { id: mission.id },
    });

    try {
      await this.missionByProgramRepository.save(missionByProgram);
    } catch (error) {
      return ResponseHelper.error("Invalid missionByProgramId provided");
    }


    return ResponseHelper.success(mission, "Mission created successfully");
  }

  async findAll(query: MissionQueryDto): Promise<{ data: Mission[]; meta: { totalItems: number; itemCount: number; itemsPerPage: number; totalPages: number; currentPage: number; }; }> {

    const where: any = {};
    const queryObj: any = { ...query };

    if (queryObj.userId && !isNaN(Number(queryObj.userId))) {
      where.user = { id: Number(queryObj.userId) };
    }

    // Map the new MissionQueryDto fields to match the database entity fields
    if (queryObj.title !== undefined) {
      queryObj.target = queryObj.title;
    }
    if (queryObj.start_date !== undefined) {
      queryObj.startAt = queryObj.start_date;
    }
    if (queryObj.end_date !== undefined) {
      queryObj.endAt = queryObj.end_date;
    }

    const { data: missions, meta } = await QueryHelper.paginate(this.missionRepository, queryObj, {
      sortField: 'id',
      searchableFields: ['target', 'status', 'startAt', 'endAt', 'user', 'missionByPrograms.program'],
      relations: ['user', 'missionByPrograms', 'missionByPrograms.program'],
      where: where,
    });

    return {
      data: missions.map((mission) => {
        if (!mission.user) {
          return mission;
        }

        const { password, ...rest } = mission.user;

        return {
          ...mission,
          user: rest.id,
          missionByPrograms: mission.missionByPrograms.map((missionByProgram) => {
            return {
              id: missionByProgram.id,
              program: missionByProgram.program,
            };
          }),
        };
      }) as Mission[],
      meta,
    };
  }


  async findOne(id: number): Promise<Mission | null> {
    if (isNaN(id)) {
      return null;
    }
    return this.missionRepository.findOne({ where: { id } });
  }

  async update(id: number, missionDto: MissionUpdateDto) {
    const {
      userId,
      missionByProgramId,
      ...missionData
    } = missionDto;

    const mission = await this.findOne(id);
    if (!mission) {
      return {
        error: true,
        message: 'Mission not found',
        data: null,
      };
    }

    // 1. update mission
    const updatePayload: any = { ...missionData };
    if (userId !== undefined) {
      updatePayload.user = { id: Number(userId) };
    }

    try {
      await this.missionRepository.update(id, updatePayload);
    } catch (error) {
      return {
        error: true,
        message: 'Invalid userId provided',
        data: null,
      };
    }

    if (missionByProgramId !== undefined) {
      try {
        await this.missionByProgramRepository.delete({
          mission: { id },
        });

        const missionByProgram = this.missionByProgramRepository.create({
          mission: { id },
          program: { id: missionByProgramId },
        });

        await this.missionByProgramRepository.save(missionByProgram);
      } catch (error) {
        return {
          error: true,
          message: 'Invalid missionByProgramId provided',
          data: null,
        };
      }
    }

    return {
      message: 'Mission updated successfully',
      data: {
        id,
      },
    };
  }

  async remove(id: number) {
    const mission = await this.findOne(id);
    if (!mission) {
      return {
        error: true,
        message: 'Mission not found',
        data: null,
      };
    }
    try {
      await this.missionRepository.delete(id);
    } catch (error) {
      return {
        error: true,
        message: 'Failed to delete mission (Reference error)',
        data: null,
      };
    }
    return {
      message: 'Mission deleted successfully',
      data: null,
    };
  }
}
