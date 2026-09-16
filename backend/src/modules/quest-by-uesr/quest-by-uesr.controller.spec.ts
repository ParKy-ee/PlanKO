import { Test, TestingModule } from '@nestjs/testing';
import { QuestByUesrController } from './quest-by-uesr.controller';
import { QuestByUesrService } from './quest-by-uesr.service';

describe('QuestByUesrController', () => {
  let controller: QuestByUesrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestByUesrController],
      providers: [QuestByUesrService],
    }).compile();

    controller = module.get<QuestByUesrController>(QuestByUesrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
