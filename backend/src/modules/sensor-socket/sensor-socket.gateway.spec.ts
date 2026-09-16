import { Test, TestingModule } from '@nestjs/testing';
import { expect } from '@jest/globals';
import { SensorSocketGateway } from './sensor-socket.gateway';
import { SensorSocketService } from './sensor-socket.service';

describe('SensorSocketGateway', () => {
  let gateway: SensorSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorSocketGateway, SensorSocketService],
    }).compile();

    gateway = module.get<SensorSocketGateway>(SensorSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
