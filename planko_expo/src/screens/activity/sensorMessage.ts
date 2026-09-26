const SENSOR_IDS = new Set([
  'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8',
  'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8',
]);

export const getPressedSensorId = (raw: string): string | null => {
  try {
    const message: unknown = JSON.parse(raw);
    if (!message || typeof message !== 'object' || Array.isArray(message)) return null;
    const payload = message as Record<string, unknown>;
    const data = payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
      ? payload.data as Record<string, unknown>
      : null;
    const sensorId = payload.sensorId ?? data?.sensorId;
    const event = payload.event ?? payload.type;
    const value = payload.value ?? data?.value;
    if (event !== undefined && event !== 'sensor-press' && event !== 'sensor:data') return null;
    if (value !== undefined && value !== 1 && value !== true) return null;
    if (typeof sensorId !== 'string') return null;
    const normalized = sensorId.trim().toUpperCase();
    return SENSOR_IDS.has(normalized) ? normalized : null;
  } catch {
    return null;
  }
};
