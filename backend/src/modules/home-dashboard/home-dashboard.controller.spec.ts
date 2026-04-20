import { Test, TestingModule } from '@nestjs/testing';
import { HomeDashboardController } from './home-dashboard.controller';
import { HomeDashboardService } from './home-dashboard.service';

describe('HomeDashboardController', () => {
  let controller: HomeDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeDashboardController],
      providers: [HomeDashboardService],
    }).compile();

    controller = module.get<HomeDashboardController>(HomeDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
