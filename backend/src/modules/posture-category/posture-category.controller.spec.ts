import { Test, TestingModule } from '@nestjs/testing';
import { PostureCategoryController } from './posture-category.controller';
import { PostureCategoryService } from './posture-category.service';

describe('PostureCategoryController', () => {
  let controller: PostureCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostureCategoryController],
      providers: [PostureCategoryService],
    }).compile();

    controller = module.get<PostureCategoryController>(PostureCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
