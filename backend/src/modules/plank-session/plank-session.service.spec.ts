import { Test, TestingModule } from '@nestjs/testing';
import { PlankSessionService } from './plank-session.service';

describe('PlankSessionService', () => {
  let service: PlankSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlankSessionService],
    }).compile();

    service = module.get<PlankSessionService>(PlankSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
