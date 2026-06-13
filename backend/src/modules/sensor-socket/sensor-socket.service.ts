import { Injectable } from '@nestjs/common';
import { SensorPayloadDto } from './dto/sensor-payload.dto';

@Injectable()
export class SensorSocketService {
  normalizePayload(payload: SensorPayloadDto) {
    return {
      sensorId: payload.sensorId?.trim(),
      value: Number(payload.value),
      unit: payload.unit ?? 'unknown',
      type: payload.type ?? 'generic',
      receivedAt: payload.timestamp ?? new Date().toISOString(),
    };
  }
}
