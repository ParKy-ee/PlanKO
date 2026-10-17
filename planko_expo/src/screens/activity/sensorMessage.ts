import { MQTT_CONFIG } from '../../config/sensor';

const SENSOR_IDS = new Set([
  'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8',
  'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8',
]);

export interface ParsedSensorEvent {
  topic?: string;
  pressedPadId?: string | null;
  bio?: {
    bpm?: number;
    avgBpm?: number;
    spo2?: number;
    fingerDetected?: boolean;
  };
  imu?: {
    roll?: number;
    pitch?: number;
    yaw?: number;
    copOffset?: number;
  };
  rawObj?: Record<string, unknown>;
}

export const getPressedSensorId = (raw: string): string | null => {
  try {
    const message: unknown = JSON.parse(raw);
    if (!message || typeof message !== 'object' || Array.isArray(message)) return null;
    const payload = message as Record<string, unknown>;
    const data = payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : null;

    // Check pressed state
    const pressedVal = payload.pressed ?? data?.pressed;
    const rawVal = payload.raw ?? data?.raw;
    const numValue = payload.value ?? data?.value;

    const isPressed =
      pressedVal === true ||
      numValue === 1 ||
      numValue === true ||
      (typeof rawVal === 'number' && rawVal >= MQTT_CONFIG.pressureThreshold);

    if (!isPressed) return null;

    // 1. Direct pad / sensorId match
    const candidateId =
      payload.sensorId ??
      data?.sensorId ??
      payload.pad ??
      data?.pad ??
      payload.padId ??
      data?.padId;

    if (typeof candidateId === 'string') {
      const normalized = candidateId.trim().toUpperCase();
      if (SENSOR_IDS.has(normalized)) return normalized;
    }

    // 2. Check "sensor" field (e.g. "L1" or "rfp602")
    const sensorName = payload.sensor ?? data?.sensor;
    if (typeof sensorName === 'string') {
      const norm = sensorName.trim().toUpperCase();
      if (SENSOR_IDS.has(norm)) return norm;
      // If sensor is a pressure sensor model like rfp602
      if (norm.includes('RFP') || norm.includes('PRESS')) {
        return (payload.pad as string) || (payload.sensorId as string) || MQTT_CONFIG.defaultPad || 'L1';
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const parseSensorEvent = (raw: string): ParsedSensorEvent | null => {
  try {
    const message = JSON.parse(raw);
    if (!message || typeof message !== 'object') return null;
    const payload = message as Record<string, unknown>;
    const topic = (payload.topic as string) || (payload._mqttTopic as string) || '';

    const pressedPadId = getPressedSensorId(raw);

    // Bio data detection (planko/bio or heartRate payload)
    let bio: ParsedSensorEvent['bio'] = undefined;
    const rawBpm = payload.bpm ?? payload.avgBpm ?? (payload.data as any)?.bpm;
    const rawSpo2 = payload.spo2 ?? payload.spo2Approx ?? (payload.data as any)?.spo2;
    const numBpm = rawBpm !== undefined && rawBpm !== null ? Number(rawBpm) : undefined;
    const numSpo2 = rawSpo2 !== undefined && rawSpo2 !== null ? Number(rawSpo2) : undefined;
    const finger = payload.finger ?? payload.fingerDetected ?? (payload.data as any)?.finger;

    if (topic.includes('bio') || numBpm !== undefined || numSpo2 !== undefined) {
      bio = {
        bpm: typeof numBpm === 'number' && !isNaN(numBpm) ? Math.round(numBpm) : undefined,
        avgBpm: typeof payload.avgBpm === 'number' ? Math.round(payload.avgBpm) : undefined,
        spo2: typeof numSpo2 === 'number' && !isNaN(numSpo2) ? Math.round(numSpo2) : undefined,
        fingerDetected: Boolean(finger),
      };
    }

    // IMU data detection (planko/imu or roll/pitch/copOffset payload)
    let imu: ParsedSensorEvent['imu'] = undefined;
    const roll = payload.roll ?? (payload.data as any)?.roll;
    const pitch = payload.pitch ?? (payload.data as any)?.pitch;
    const copOffset = payload.copOffset ?? (payload.data as any)?.copOffset;
    if (topic.includes('imu') || roll !== undefined || pitch !== undefined || copOffset !== undefined) {
      imu = {
        roll: typeof roll === 'number' ? roll : undefined,
        pitch: typeof pitch === 'number' ? pitch : undefined,
        copOffset: typeof copOffset === 'number' ? copOffset : undefined,
      };
    }

    return {
      topic,
      pressedPadId,
      bio,
      imu,
      rawObj: payload,
    };
  } catch {
    return null;
  }
};
