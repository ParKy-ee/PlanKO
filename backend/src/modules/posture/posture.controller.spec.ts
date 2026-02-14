import { Test, TestingModule } from '@nestjs/testing';
import { PostureController } from './posture.controller';
import { PostureService } from './posture.service';

describe('PostureController', () => {
  let controller: PostureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostureController],
      providers: [PostureService],
    }).compile();

    controller = module.get<PostureController>(PostureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
