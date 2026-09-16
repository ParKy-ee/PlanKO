import { Test, TestingModule } from '@nestjs/testing';
import { PlankBySessionController } from './plank-by-session.controller';
import { PlankBySessionService } from './plank-by-session.service';

describe('PlankBySessionController', () => {
  let controller: PlankBySessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlankBySessionController],
      providers: [PlankBySessionService],
    }).compile();

    controller = module.get<PlankBySessionController>(PlankBySessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
