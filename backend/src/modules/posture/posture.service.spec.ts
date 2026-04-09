import { Test, TestingModule } from '@nestjs/testing';
import { PostureService } from './posture.service';

describe('PostureService', () => {
  let service: PostureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostureService],
    }).compile();

    service = module.get<PostureService>(PostureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
