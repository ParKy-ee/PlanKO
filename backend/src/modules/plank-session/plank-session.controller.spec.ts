import { Test, TestingModule } from '@nestjs/testing';
import { PlankSessionController } from './plank-session.controller';
import { PlankSessionService } from './plank-session.service';

describe('PlankSessionController', () => {
  let controller: PlankSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlankSessionController],
      providers: [PlankSessionService],
    }).compile();

    controller = module.get<PlankSessionController>(PlankSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
