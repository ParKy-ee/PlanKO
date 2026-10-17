// PlanKO Sensor Connection Configuration

export type SensorSource = 'mqtt' | 'websocket' | 'mock';

// Set active sensor stream source
export const SENSOR_SOURCE: SensorSource = 'mqtt';

// Direct ESP32 LAN WebSocket address (fallback)
export const SENSOR_WS_URL = 'ws://192.168.1.122:81/';

// MQTT Configuration (matching EMQX broker & topics)
export const MQTT_CONFIG = {
  enabled: true,
  // EMQX Public Broker (WebSocket support: 8083 for ws, 8084 for wss)
  host: 'broker.emqx.io',
  port: 8083,
  path: '/mqtt',
  useSSL: false,
  clientIdPrefix: 'planko_mobile_',
  topics: [
    'planko/#',
    'planko/pressure',
    'planko/imu',
    'planko/bio',
  ],
  // Default workout pad mapped when sensor sends generic pressure sensor (e.g. rfp602)
  defaultPad: 'L1',
  // Optional raw pressure threshold if pressed boolean is not present
  pressureThreshold: 20,
};
