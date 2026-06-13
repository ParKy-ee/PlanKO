import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorSocketGateway } from './sensor-socket.gateway';
import { SensorSocketService } from './sensor-socket.service';
import { SensorData } from './entities/sensor.entities';

@Module({
  imports: [TypeOrmModule.forFeature([SensorData])],
  providers: [SensorSocketGateway, SensorSocketService],
})
export class SensorSocketModule {}
