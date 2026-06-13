import { Test, TestingModule } from '@nestjs/testing';
import { PlankBySessionService } from './plank-by-session.service';

describe('PlankBySessionService', () => {
  let service: PlankBySessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlankBySessionService],
    }).compile();

    service = module.get<PlankBySessionService>(PlankBySessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
