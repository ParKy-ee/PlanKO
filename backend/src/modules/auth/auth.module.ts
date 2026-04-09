import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStategy } from './stategies/local.stategies'
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './stategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Mission } from '../mission/entities/mission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [UserModule, PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Mission]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStategy, JwtStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule { }
