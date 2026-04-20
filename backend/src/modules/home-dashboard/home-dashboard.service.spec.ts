import { Test, TestingModule } from '@nestjs/testing';
import { HomeDashboardService } from './home-dashboard.service';

describe('HomeDashboardService', () => {
  let service: HomeDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeDashboardService],
    }).compile();

    service = module.get<HomeDashboardService>(HomeDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
