import { Test, TestingModule } from '@nestjs/testing';
import { UserQuestsService } from './user-quests.service';

describe('UserQuestsService', () => {
  let service: UserQuestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQuestsService],
    }).compile();

    service = module.get<UserQuestsService>(UserQuestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
