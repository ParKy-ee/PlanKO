import { NativeModules, Platform } from 'react-native';
import type {
  BridgeStatusHandler,
  GameModelFrameHandler,
  GameSensorFrame,
} from '../types/gameModel';

const BRIDGE_PORT = 8765;
const BRIDGE_PATH = '/ws';
const RETRY_DELAY_MS = 3000;

const getBridgeUrl = (): string | null => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${scheme}//${window.location.hostname}:${BRIDGE_PORT}${BRIDGE_PATH}`;
  }

  const scriptURL = NativeModules.SourceCode?.scriptURL;
  if (typeof scriptURL !== 'string') return null;

  const host = scriptURL.match(/^https?:\/\/([^/:?#]+)/i)?.[1];
  if (!host) return null;
  const scheme = scriptURL.toLowerCase().startsWith('https:') ? 'wss:' : 'ws:';
  return `${scheme}//${host}:${BRIDGE_PORT}${BRIDGE_PATH}`;
};

const isGameSensorFrame = (value: unknown): value is GameSensorFrame => {
  if (!value || typeof value !== 'object') return false;
  const frame = value as Record<string, unknown>;
  return (
    frame.type === 'game_snapshot' &&
    Array.isArray(frame.nodes) &&
    !!frame.model &&
    typeof frame.model === 'object'
  );
};

export const connectGameModelBridge = (
  onFrame: GameModelFrameHandler,
  onStatus: BridgeStatusHandler,
): (() => void) => {
  const url = getBridgeUrl();
  if (!url) {
    onStatus('off', 'หา address ของ Expo development server ไม่พบ');
    return () => {};
  }

  let active = true;
  let socket: WebSocket | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const connect = () => {
    if (!active) return;
    onStatus('connecting');

    try {
      socket = new WebSocket(url);
    } catch (error) {
      onStatus('disconnected', error instanceof Error ? error.message : 'สร้าง WebSocket ไม่สำเร็จ');
      retryTimer = setTimeout(connect, RETRY_DELAY_MS);
      return;
    }

    socket.onopen = () => {
      if (active) onStatus('connected');
    };
    socket.onmessage = (event) => {
      if (!active || typeof event.data !== 'string') return;
      try {
        const parsed: unknown = JSON.parse(event.data);
        if (isGameSensorFrame(parsed)) onFrame(parsed);
      } catch {
        // Ignore a malformed bridge frame and wait for its next snapshot.
      }
    };
    socket.onerror = () => {
      if (active) onStatus('disconnected', `เชื่อมต่อ model bridge ไม่ได้ (${url})`);
    };
    socket.onclose = () => {
      if (!active) return;
      onStatus('disconnected');
      retryTimer = setTimeout(connect, RETRY_DELAY_MS);
    };
  };

  connect();
  return () => {
    active = false;
    if (retryTimer) clearTimeout(retryTimer);
    socket?.close();
  };
};

export const INITIAL_GAME_MODEL_FRAME: GameSensorFrame = {
  type: 'game_snapshot',
  mqttStatus: 'connecting',
  mqttError: null,
  topic: 'planko/imu',
  receivedAt: null,
  gateway: null,
  pressure: null,
  droppedPayloads: 0,
  model: {
    bundle: 'model',
    versions: [],
    requiresCalibration: true,
    windowSeconds: 0.5,
    samplingHz: 20,
  },
  nodes: [1, 2, 3].map((nodeId) => ({
    nodeId,
    status: 'missing',
    telemetry: null,
    prediction: {
      action: 'unknown',
      stage: 'unknown',
      score: null,
      phaseScore: null,
      scoreKind: 'unavailable',
      modelVersion: 'unavailable',
      reason: 'waiting_for_imu',
      calibrated: false,
    },
    missingFields: [],
  })),
};

