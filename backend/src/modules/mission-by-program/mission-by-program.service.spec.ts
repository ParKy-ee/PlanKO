import { Test, TestingModule } from '@nestjs/testing';
import { MissionByProgramService } from './mission-by-program.service';

describe('MissionByProgramService', () => {
  let service: MissionByProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionByProgramService],
    }).compile();

    service = module.get<MissionByProgramService>(MissionByProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
