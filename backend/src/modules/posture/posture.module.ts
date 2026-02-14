import { Module } from '@nestjs/common';
import { PostureService } from './posture.service';
import { PostureController } from './posture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posture } from './entities/posture.entity';
import { PostureByProgram } from '../posture-by-program/entities/posture-by-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posture, PostureByProgram])],
  controllers: [PostureController],
  providers: [PostureService],
})
export class PostureModule { }
