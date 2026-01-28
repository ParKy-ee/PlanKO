import { Test, TestingModule } from '@nestjs/testing';
import { MissionByProgramController } from './mission-by-program.controller';
import { MissionByProgramService } from './mission-by-program.service';

describe('MissionByProgramController', () => {
  let controller: MissionByProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionByProgramController],
      providers: [MissionByProgramService],
    }).compile();

    controller = module.get<MissionByProgramController>(MissionByProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
