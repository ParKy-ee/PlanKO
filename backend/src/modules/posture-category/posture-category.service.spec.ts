import { Test, TestingModule } from '@nestjs/testing';
import { PostureCategoryService } from './posture-category.service';

describe('PostureCategoryService', () => {
  let service: PostureCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostureCategoryService],
    }).compile();

    service = module.get<PostureCategoryService>(PostureCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
