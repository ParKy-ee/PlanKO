import { Injectable } from '@nestjs/common';
import { PostureDto } from './dto/posture.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posture } from './entities/posture.entity';
import { Repository } from 'typeorm';
import { UserQueryDto } from 'src/commons/dtos/user-query.dto';
import { QueryHelper } from 'src/commons/helpers/query.helper';



@Injectable()
export class PostureService {

  constructor(@InjectRepository(Posture) private readonly postureRepository: Repository<Posture>) { }

  async create(createPostureDto: PostureDto) {
    const posture = this.postureRepository.create(createPostureDto);
    return await this.postureRepository.save(posture);
  }

  async findAll(query: UserQueryDto) {
    const { data: postures, meta } = await QueryHelper.paginate(this.postureRepository, query, {
      sortField: 'id',
      searchableFields: ['postureName', 'postureType', 'postureDescription', 'status'],
    });

    return {
      data: postures,
      meta,
    };
  }

  async findOne(id: number) {
    return await this.postureRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePostureDto: PostureDto) {
    await this.postureRepository.update(id, updatePostureDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.postureRepository.delete(id);
  }
}
