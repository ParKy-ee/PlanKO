import { Test, TestingModule } from '@nestjs/testing';
import { QuestsCategortyService } from './quests-categorty.service';

describe('QuestsCategortyService', () => {
  let service: QuestsCategortyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestsCategortyService],
    }).compile();

    service = module.get<QuestsCategortyService>(QuestsCategortyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
