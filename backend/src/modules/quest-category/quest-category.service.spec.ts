import { Test, TestingModule } from '@nestjs/testing';
import { QuestCategoryService } from './quest-category.service';

describe('QuestCategoryService', () => {
  let service: QuestCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestCategoryService],
    }).compile();

    service = module.get<QuestCategoryService>(QuestCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
