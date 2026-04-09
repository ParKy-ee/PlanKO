import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from '../../modules/mission/entities/mission.entity';
import { Repository } from 'typeorm';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { MissionByProgram } from '../../modules/mission-by-program/entities/mission-by-program.entity';
<<<<<<< HEAD
import { MissionCreateDto } from './dto/mission-create.dto';
import { MissionUpdateDto } from './dto/misson-update.dto';
=======
import { MissionUpdatesDto } from './dto/mission-update.dto';
import { MissionQueryDto } from 'src/commons/dtos/mission-query.dto';
import { ResponseHelper } from 'src/commons/helpers/response.helper';
>>>>>>> feat/quest

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(MissionByProgram)
    private missionByProgramRepository: Repository<MissionByProgram>,
  ) { }

<<<<<<< HEAD
  async create(missionDto: MissionCreateDto) {
=======
  async create(missionDto: MissionDto) {

>>>>>>> feat/quest
    const { userId, ...rest } = missionDto;

    const mission = this.missionRepository.create({
      ...rest,
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


    return ResponseHelper.success("Mission created successfully");
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
          user: rest,
          missionByPrograms: mission.missionByPrograms.map((missionByProgram) => {
            return {
              ...missionByProgram,
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

<<<<<<< HEAD
  async update(id: number, missionDto: MissionUpdateDto) {
=======
  async update(id: number, missionDto: MissionUpdatesDto) {
>>>>>>> feat/quest
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

<<<<<<< HEAD
    await this.missionRepository.update(id, {
      ...missionData,
      user: { id: userId },
    });
=======
    // 1. update mission
    const updatePayload: any = { ...missionData };
    if (userId !== undefined) {
      updatePayload.user = { id: Number(userId) };
    }
>>>>>>> feat/quest

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
