import { Test, TestingModule } from '@nestjs/testing';
import { ProgramPlanController } from './program-plan.controller';
import { ProgramPlanService } from './program-plan.service';

describe('ProgramPlanController', () => {
  let controller: ProgramPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramPlanController],
      providers: [ProgramPlanService],
    }).compile();

    controller = module.get<ProgramPlanController>(ProgramPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
