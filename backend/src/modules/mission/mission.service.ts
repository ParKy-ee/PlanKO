import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from '../../modules/mission/entities/mission.entity';
import { Repository } from 'typeorm';
import { UserQueryDto } from 'src/commons/dtos/user-query.dto';
import { QueryHelper } from 'src/commons/helpers/query.helper';
import { MissionByProgram } from '../../modules/mission-by-program/entities/mission-by-program.entity';
import { MissionCreateDto } from './dto/mission-create.dto';
import { MissionUpdateDto } from './dto/misson-update.dto';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(MissionByProgram)
    private missionByProgramRepository: Repository<MissionByProgram>,
  ) { }

  async create(missionDto: MissionCreateDto) {
    const { userId, ...rest } = missionDto;

    const mission = this.missionRepository.create({
      ...rest,
      user: { id: userId },
    });

    await this.missionRepository.save(mission);

    const missionByProgram = this.missionByProgramRepository.create({
      program: { id: missionDto.missionByProgramId },
      mission: { id: mission.id },
    })
    await this.missionByProgramRepository.save(missionByProgram);


    return {
      message: 'Mission created successfully',
      data: mission,
    };
  }
  async findAll(query: UserQueryDto): Promise<{ data: Mission[]; meta: { totalItems: number; itemCount: number; itemsPerPage: number; totalPages: number; currentPage: number; }; }> {
    const { data: missions, meta } = await QueryHelper.paginate(this.missionRepository, query, {
      sortField: 'id',
      searchableFields: ['target', 'status', 'startAt', 'endAt', 'user'],
      relations: ['user', 'missionByPrograms'],
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
      throw new Error('Mission not found');
    }

    await this.missionRepository.update(id, {
      ...missionData,
      user: { id: userId },
    });

    await this.missionByProgramRepository.delete({
      mission: { id },
    });


    const missionByProgram = this.missionByProgramRepository.create({
      mission: { id },
      program: { id: missionByProgramId },
    });

    await this.missionByProgramRepository.save(missionByProgram);

    return {
      message: 'Mission updated successfully',
      data: {
        id,
      },
    };
  }

  remove(id: number) {
    return this.missionRepository.delete(id);
  }
}
