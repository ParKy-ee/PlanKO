import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorPayloadDto } from './dto/sensor-payload.dto';
import { BodySensorPayloadDto } from './dto/body-sensor-payload.dto';
import { SensorData } from './entities/sensor.entities';

@Injectable()
export class SensorSocketService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepo: Repository<SensorData>,
  ) {}

  normalizePayload(payload: SensorPayloadDto) {
    return {
      sensorId: payload.sensorId?.trim(),
      value: Number(payload.value),
      unit: payload.unit ?? 'unknown',
      type: payload.type ?? 'generic',
      receivedAt: payload.timestamp ?? new Date().toISOString(),
    };
  }

  async saveBodySensorData(payload: BodySensorPayloadDto): Promise<SensorData> {
    const newData = this.sensorDataRepo.create({
      r: payload.r ? String(payload.r) : '0',
      red: payload.red ? String(payload.red) : '0',
      fingerDetected: payload.fingerDetected,
      bpm: payload.bpm,
      avgBpm: payload.avgBpm,
      spo2Approx: payload.spo2Approx,
    });
    
    return await this.sensorDataRepo.save(newData);
  }
}
