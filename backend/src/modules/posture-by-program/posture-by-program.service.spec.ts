import { Test, TestingModule } from '@nestjs/testing';
import { PostureByProgramService } from './posture-by-program.service';

describe('PostureByProgramService', () => {
  let service: PostureByProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostureByProgramService],
    }).compile();

    service = module.get<PostureByProgramService>(PostureByProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
