import { Test, TestingModule } from '@nestjs/testing';
import { QuestsCategortyController } from './quests-categorty.controller';
import { QuestsCategortyService } from './quests-categorty.service';

describe('QuestsCategortyController', () => {
  let controller: QuestsCategortyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestsCategortyController],
      providers: [QuestsCategortyService],
    }).compile();

    controller = module.get<QuestsCategortyController>(QuestsCategortyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
