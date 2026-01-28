import { Test, TestingModule } from '@nestjs/testing';
import { SeesionPerfomanceService } from './seesion-perfomance.service';

describe('SeesionPerfomanceService', () => {
  let service: SeesionPerfomanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeesionPerfomanceService],
    }).compile();

    service = module.get<SeesionPerfomanceService>(SeesionPerfomanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
