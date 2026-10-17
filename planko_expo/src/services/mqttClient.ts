import Paho from 'paho-mqtt';
import { MQTT_CONFIG } from '../config/sensor';
import { dataStorage } from './dataStorage';

export type MqttConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export interface MqttHandlers {
  onStatusChange?: (status: MqttConnectionStatus) => void;
  onError?: (error: unknown) => void;
  onMessage?: (topic: string, message: string) => void;
}

let client: Paho.Client | null = null;
let active = false;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

export const connectMqtt = (
  handlers: MqttHandlers = {},
  retryDelayMs = 5000,
): (() => void) => {
  active = true;

  const connect = () => {
    if (!active) return;

    handlers.onStatusChange?.('connecting');
    const clientId = `${MQTT_CONFIG.clientIdPrefix}${Math.random().toString(16).slice(2, 10)}`;

    try {
      client = new Paho.Client(
        MQTT_CONFIG.host,
        MQTT_CONFIG.port,
        MQTT_CONFIG.path,
        clientId,
      );
    } catch (err) {
      console.warn('[PlanKO MQTT] Client init failed:', err);
      handlers.onError?.(err);
      handlers.onStatusChange?.('disconnected');
      if (active) retryTimer = setTimeout(connect, retryDelayMs);
      return;
    }

    client.onConnectionLost = (responseObject) => {
      if (!active) return;
      console.log(`[PlanKO MQTT] Connection lost: ${responseObject.errorMessage || 'Unknown reason'}; retrying...`);
      handlers.onStatusChange?.('disconnected');
      retryTimer = setTimeout(connect, retryDelayMs);
    };

    client.onMessageArrived = (message: Paho.Message) => {
      if (!active) return;
      const topic = message.destinationName;
      const payloadString = message.payloadString;

      console.log(`[PlanKO MQTT] Message on "${topic}":`, payloadString);
      handlers.onMessage?.(topic, payloadString);

      // Normalize into event envelope for storage and real-time app listeners
      let parsed: Record<string, unknown> = {};
      try {
        const json = JSON.parse(payloadString);
        if (json && typeof json === 'object' && !Array.isArray(json)) {
          parsed = json as Record<string, unknown>;
        } else {
          parsed = { value: json };
        }
      } catch {
        parsed = { rawPayload: payloadString };
      }

      // Combine with topic metadata
      const enrichedEvent = {
        topic,
        type: topic,
        ...parsed,
        _mqttTopic: topic,
        _receivedAt: new Date().toISOString(),
      };

      dataStorage.receiveWebSocketMessage(JSON.stringify(enrichedEvent)).catch((err) => {
        console.warn('[PlanKO MQTT] Error storing event:', err);
      });
    };

    const connectOptions: Paho.ConnectionOptions = {
      timeout: 15,
      keepAliveInterval: 30,
      cleanSession: true,
      useSSL: MQTT_CONFIG.useSSL,
      onSuccess: () => {
        if (!active) {
          try {
            client?.disconnect();
          } catch {}
          return;
        }

        console.log(`[PlanKO MQTT] Successfully connected to ${MQTT_CONFIG.host}:${MQTT_CONFIG.port}${MQTT_CONFIG.path}`);
        handlers.onStatusChange?.('connected');

        // Subscribe to configured topics
        MQTT_CONFIG.topics.forEach((topic) => {
          try {
            client?.subscribe(topic, { qos: 0 });
            console.log(`[PlanKO MQTT] Subscribed to "${topic}"`);
          } catch (err) {
            console.warn(`[PlanKO MQTT] Failed to subscribe to "${topic}":`, err);
          }
        });
      },
      onFailure: (error) => {
        if (!active) return;
        console.warn('[PlanKO MQTT] Connect failed:', error?.errorMessage || error);
        handlers.onError?.(error);
        handlers.onStatusChange?.('disconnected');
        retryTimer = setTimeout(connect, retryDelayMs);
      },
    };

    try {
      client.connect(connectOptions);
    } catch (err) {
      console.warn('[PlanKO MQTT] connect() invocation error:', err);
      handlers.onError?.(err);
      handlers.onStatusChange?.('disconnected');
      if (active) retryTimer = setTimeout(connect, retryDelayMs);
    }
  };

  connect();

  return () => {
    active = false;
    if (retryTimer) clearTimeout(retryTimer);
    try {
      if (client?.isConnected()) {
        client.disconnect();
      }
    } catch {}
  };
};
