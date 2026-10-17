export type BridgeConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'off';
export type ImuNodeStatus = 'live' | 'missing' | 'stale';

export interface GameImuTelemetry {
  seq: number;
  ts: number;
  pitch: number;
  roll: number;
  yaw: number;
  dropped: number;
  isMock: boolean;
  accel: [number, number, number] | null;
  gyro: [number, number, number] | null;
  bio: {
    bpm: number | null;
    spo2: number | null;
    finger: boolean;
  };
}

export interface GameModelPrediction {
  action: string;
  stage: string;
  score: number | null;
  phaseScore: number | null;
  scoreKind: string;
  modelVersion: string;
  reason: string;
  calibrated: boolean;
  mountSite?: string;
  bodyPart?: string;
  heldMs?: number;
}

export interface GameImuNode {
  nodeId: number;
  status: ImuNodeStatus;
  telemetry: GameImuTelemetry | null;
  prediction: GameModelPrediction;
  missingFields: string[];
}

export interface GameSensorFrame {
  type: 'game_snapshot';
  mqttStatus: 'connecting' | 'connected' | 'disconnected';
  mqttError: string | null;
  topic: string;
  receivedAt: number | null;
  gateway: { uptimeMs: number; connectedNodes: number } | null;
  pressure: { raw: number; voltage: number; pressed: boolean } | null;
  droppedPayloads: number;
  model: {
    bundle: string;
    versions: string[];
    requiresCalibration: boolean;
    windowSeconds: number;
    samplingHz: number;
  };
  nodes: GameImuNode[];
}

export type GameModelFrameHandler = (frame: GameSensorFrame) => void;
export type BridgeStatusHandler = (status: BridgeConnectionStatus, error?: string) => void;
