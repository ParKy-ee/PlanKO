import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MissionByProgram } from './entities/mission-by-program.entity';
import { Repository } from 'typeorm';
import { MissionByProgramDto } from './dto/mission-by-program.dto';

@Injectable()
export class MissionByProgramService {

  constructor(
    @InjectRepository(MissionByProgram)
    private readonly missionByProgramRepository: Repository<MissionByProgram>,
  ) { }

  async addMissionToProgram(programId: number, missionId: number) {
    const exists = await this.missionByProgramRepository.findOne({
      where: {
        program: { id: programId },
        mission: { id: missionId }
      }
    })

    if (exists) {
      throw new Error('Mission already exists in program');
    }

    const missionByProgram = this.missionByProgramRepository.create({
      program: { id: programId },
      mission: { id: missionId }
    })

    return this.missionByProgramRepository.save(missionByProgram)
  }

  async removeMissionFromProgram(programId: number, missionId: number) {
    return this.missionByProgramRepository.delete({ program: { id: programId }, mission: { id: missionId } });
  }

  async getMissionsByProgram() {
    return this.missionByProgramRepository.find({
      relations: ['mission', 'program'],
    });
  }

  async update(id: number, updateMissionByProgramDto: MissionByProgramDto) {
    return this.missionByProgramRepository.update(id, {
      mission: { id: updateMissionByProgramDto.missionId },
      program: { id: updateMissionByProgramDto.programId }
    });
  }

}
