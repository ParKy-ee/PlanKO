import { Test, TestingModule } from '@nestjs/testing';
import { QuestByUesrService } from './quest-by-uesr.service';

describe('QuestByUesrService', () => {
  let service: QuestByUesrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestByUesrService],
    }).compile();

    service = module.get<QuestByUesrService>(QuestByUesrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
