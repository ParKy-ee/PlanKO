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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const result = user;
      return {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      };
    }
    return null;


  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }

  async getProfile(user: any) {
    const missions = await this.missionRepository.findOne({ where: { user: { id: user.id } } });
    console.log(missions)
    return { user, missions };
  }

}