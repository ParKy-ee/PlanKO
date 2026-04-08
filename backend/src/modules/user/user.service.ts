import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQueryDto } from '../../commons/dtos/user-query.dto';
import { QueryHelper } from '../../commons/helpers/query.helper';
import { QuestByUser } from '../quest-by-uesr/entities/quest-by-uesr.entity';
import { Quest } from '../quest/entities/quest.entity';
import { Status } from '../../commons/enums/status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(QuestByUser) private readonly questByUserRepository: Repository<QuestByUser>,
    @InjectRepository(Quest) private readonly questRepository: Repository<Quest>
  ) { }

  async create(userDto: UserDto) {
    try {
      const user = this.userRepository.create(userDto);
      await this.userRepository.save(user);

      const quests = await this.questRepository.find();

      const questByUsers = quests.map((quest) =>
        this.questByUserRepository.create({
          user: user,
          quest: quest,
          current_value: 0,
          target_value: quest.goal_value,
          status: Status.PENDING,
          completed_at: null,
        })
      );

      // 4. save ทีเดียว
      await this.questByUserRepository.save(questByUsers);

      return {
        message: 'User created and quests assigned',
        data: user,
      };

    } catch (error) {
      return {
        error: true,
        message: 'Create user failed',
        data: null,
      };
    }
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

  async findUserByName(name: string): Promise<User | null> {
    return this.userRepository.findOne({ where: [{ name }, { email: name }], });
  }

  async findOne(id: number): Promise<User | null> {
    if (isNaN(id)) {
      return null;
    }
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, userDto: UserDto) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const user = await this.findOne(id);
    if (!user) {
      return { error: true, message: 'User not found', data: null };
    }

    try {
      await this.userRepository.update(id, userDto);
      return { message: 'User updated successfully', data: { id } };
    } catch (error) {
      return { error: true, message: 'Invalid data provided for update', data: null };
    }
  }

  async remove(id: number) {
    if (isNaN(id)) {
      return { error: true, message: 'Invalid id provided', data: null };
    }

    const user = await this.findOne(id);
    if (!user) {
      return { error: true, message: 'User not found', data: null };
    }

    try {
      await this.userRepository.delete(id);
      return { message: 'User deleted successfully', data: null };
    } catch (error) {
      return { error: true, message: 'Failed to delete user (Reference error)', data: null };
    }
  }
}
