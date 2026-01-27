import { Injectable } from '@nestjs/common';
import { MissionDto } from './dto/mission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from '../../modules/mission/entities/mission.entity';
import { Repository } from 'typeorm';
import { UserQueryDto } from 'src/commons/dtos/user-query.dto';
import { QueryHelper } from 'src/commons/helpers/query.helper';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) { }

  async create(missionDto: MissionDto) {
    const { userId, ...rest } = missionDto;

    const mission = this.missionRepository.create({
      ...rest,
      user: { id: userId },
    });

    return this.missionRepository.save(mission);
  }
  async findAll(query: UserQueryDto): Promise<{ data: Mission[]; meta: { totalItems: number; itemCount: number; itemsPerPage: number; totalPages: number; currentPage: number; }; }> {
    const { data: missions, meta } = await QueryHelper.paginate(this.missionRepository, query, {
      sortField: 'id',
      searchableFields: ['target', 'status', 'startAt', 'endAt', 'user'],
      relations: ['user'],
    });

    return {
      data: missions.map((mission) => {

        const { password, ...rest } = mission.user;
        return {
          ...mission,
          user: { ...rest },
        }
      }) as unknown as Mission[],
      meta: meta
    };
  }


  async findOne(id: number): Promise<Mission | null> {
    return this.missionRepository.findOne({ where: { id } });
  }

  async update(id: number, missionDto: MissionDto) {
    const { userId, ...rest } = missionDto;
    const mission = await this.findOne(id);
    if (!mission) {
      throw new Error('Mission not found');
    }
    const updatedMission = await this.missionRepository.update(id, { ...rest, user: { id: userId } })
    return {
      message: 'Mission updated successfully',
      data: {
        id,
        ...rest,
        user: { id: userId },
      },
    };
  }

  remove(id: number) {
    return this.missionRepository.delete(id);
  }
}
