import { Test, TestingModule } from '@nestjs/testing';
import { QuestCategoryController } from './quest-category.controller';
import { QuestCategoryService } from './quest-category.service';

describe('QuestCategoryController', () => {
  let controller: QuestCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestCategoryController],
      providers: [QuestCategoryService],
    }).compile();

    controller = module.get<QuestCategoryController>(QuestCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
