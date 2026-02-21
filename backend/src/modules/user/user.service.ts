import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQueryDto } from '../../commons/dtos/user-query.dto';
import { QueryHelper } from '../../commons/helpers/query.helper';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  async create(userDto: UserDto): Promise<User> {
    const user = this.userRepository.create(userDto);
    return this.userRepository.save(user);
  }

  async findAll(query: UserQueryDto): Promise<{ data: User[]; meta: { totalItems: number; itemCount: number; itemsPerPage: number; totalPages: number; currentPage: number; }; }> {
    const { data: users, meta } = await QueryHelper.paginate(this.userRepository, query, {
      sortField: 'id',
      searchableFields: ['name', 'email', 'role', 'missions.missionByPrograms.program.programName', 'missions.missionByPrograms.program.programType'],
      relations: ['missions', 'missions.missionByPrograms', 'missions.missionByPrograms.program'],
    });

    return {
      data: users,
      meta: meta
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, userDto: UserDto): Promise<User> {
    await this.userRepository.update(id, userDto);
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
