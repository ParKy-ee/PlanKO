import { Test, TestingModule } from '@nestjs/testing';
import { PostureByProgramController } from './posture-by-program.controller';
import { PostureByProgramService } from './posture-by-program.service';

describe('PostureByProgramController', () => {
  let controller: PostureByProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostureByProgramController],
      providers: [PostureByProgramService],
    }).compile();

    controller = module.get<PostureByProgramController>(PostureByProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
