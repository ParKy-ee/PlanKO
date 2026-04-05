import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MissionByProgram } from './entities/mission-by-program.entity';
import { Repository } from 'typeorm';
import { MissionByProgramDto } from './dto/mission-by-program.dto';
import { MissionByProgramUpdateDto } from './dto/mission-by-program-update.dto';

@Injectable()
export class MissionByProgramService {

  constructor(
    @InjectRepository(MissionByProgram)
    private readonly missionByProgramRepository: Repository<MissionByProgram>,
  ) { }

  async addMissionToProgram(programId: number, missionId: number) {
    if (isNaN(programId) || isNaN(missionId)) {
      return { error: true, message: 'Invalid programId or missionId', data: null };
    }

    const exists = await this.missionByProgramRepository.findOne({
      where: {
        program: { id: programId },
        mission: { id: missionId }
      }
    });

    if (exists) {
      return { error: true, message: 'Mission already exists in program', data: null };
    }

    const missionByProgram = this.missionByProgramRepository.create({
      program: { id: programId },
      mission: { id: missionId }
    });

    try {
      await this.missionByProgramRepository.save(missionByProgram);
      return { message: 'Mission added to program successfully', data: missionByProgram };
    } catch (error) {
      return { error: true, message: 'Invalid programId or missionId provided', data: null };
    }
  }

  async removeMissionFromProgram(programId: number, missionId: number) {
    if (isNaN(programId) || isNaN(missionId)) {
      return { error: true, message: 'Invalid programId or missionId', data: null };
    }

    try {
      await this.missionByProgramRepository.delete({ program: { id: programId }, mission: { id: missionId } });
      return { message: 'Mission removed from program successfully', data: null };
    } catch (error) {
      return { error: true, message: 'Failed to remove mission from program (Reference error)', data: null };
    }
  }

  async getMissionsByProgram() {
    return this.missionByProgramRepository.find({
      relations: ['mission', 'program'],
    });
  }

  async update(id: number, updateMissionByProgramDto: MissionByProgramUpdateDto) {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const exists = await this.missionByProgramRepository.findOne({ where: { id: parsedId } });
    if (!exists) {
      return { error: true, message: 'Record not found', data: null };
    }

    try {
      await this.missionByProgramRepository.update(parsedId, {
        mission: { id: updateMissionByProgramDto.missionId },
        program: { id: updateMissionByProgramDto.programId }
      });
      return { message: 'Updated successfully', data: { id: parsedId } };
    } catch (error) {
      return { error: true, message: 'Invalid missionId or programId provided', data: null };
    }
  }

}
