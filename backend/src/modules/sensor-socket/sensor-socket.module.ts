import { Module } from '@nestjs/common';
import { SensorSocketGateway } from './sensor-socket.gateway';
import { SensorSocketService } from './sensor-socket.service';

@Module({
  providers: [SensorSocketGateway, SensorSocketService],
})
export class SensorSocketModule {}
