import { Injectable } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from '../mission/entities/mission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
  ) { }

  async validateUser(name: string, password: string): Promise<any> {
    if (!name || typeof name !== 'string') return null;
    if (!password || typeof password !== 'string') return null;

    const user = await this.userService.findUserByName(name);
    if (!user) return null;

    try {
      if (await bcrypt.compare(password, user.password)) {
        const result = user;
        return {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
        };
      }
    } catch (error) {
      return null;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }

  async getProfile(user: any) {
    if (!user || !user.id || isNaN(user.id)) {
      return { error: true, message: 'Invalid user session', data: null };
    }

    try {
      const missions = await this.missionRepository.findOne({ where: { user: { id: user.id } } });
      return { user, missions };
    } catch (error) {
       return { error: true, message: 'Error retrieving user data', data: null };
    }
  }

}