import { Test, TestingModule } from '@nestjs/testing';
import { UserQuestsController } from './user-quests.controller';
import { UserQuestsService } from './user-quests.service';

describe('UserQuestsController', () => {
  let controller: UserQuestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserQuestsController],
      providers: [UserQuestsService],
    }).compile();

    controller = module.get<UserQuestsController>(UserQuestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
