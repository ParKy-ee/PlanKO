import { Test, TestingModule } from '@nestjs/testing';
import { SeesionPerfomanceController } from './seesion-perfomance.controller';
import { SeesionPerfomanceService } from './seesion-perfomance.service';

describe('SeesionPerfomanceController', () => {
  let controller: SeesionPerfomanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeesionPerfomanceController],
      providers: [SeesionPerfomanceService],
    }).compile();

    controller = module.get<SeesionPerfomanceController>(SeesionPerfomanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
