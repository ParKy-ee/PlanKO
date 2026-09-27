import AsyncStorage from '@react-native-async-storage/async-storage';

const API_CACHE_PREFIX = '@planko_api:';
const WEBSOCKET_LATEST_PREFIX = '@planko_ws_latest:';
const WEBSOCKET_HISTORY_KEY = '@planko_ws_history';
const MAX_WEBSOCKET_HISTORY = 100;

export interface StoredWebSocketEvent<T = unknown> {
  type: string;
  data: T;
  raw: string;
  receivedAt: string;
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected';

export interface WebSocketHandlers {
  onStatusChange?: (status: WebSocketStatus) => void;
  onError?: (error: unknown) => void;
}

type WebSocketListener = (event: StoredWebSocketEvent) => void;
export type ApiRequestOptions = { fallbackToCache?: boolean };

const memoryStorage = new Map<string, string>();
const writeQueues = new Map<string, Promise<void>>();
const eventListeners = new Set<WebSocketListener>();
let websocketEventQueue: Promise<void> = Promise.resolve();

const getRawItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) memoryStorage.set(key, value);
    return value ?? memoryStorage.get(key) ?? null;
  } catch (error) {
    if (memoryStorage.has(key)) return memoryStorage.get(key) ?? null;
    throw error;
  }
};

const setRawItem = (key: string, value: string): Promise<void> => {
  const previousWrite = writeQueues.get(key) ?? Promise.resolve();
  const write = previousWrite.then(async () => {
    await AsyncStorage.setItem(key, value);
    memoryStorage.set(key, value);
  });

  // Keep later writes usable even if a previous write failed; return this write's
  // own error to the caller so data is never published as saved when it was not.
  writeQueues.set(key, write.then(() => undefined, () => undefined));
  return write;
};

const parseEvent = (raw: string): StoredWebSocketEvent => {
  let data: unknown = raw;
  let type = 'message';

  try {
    data = JSON.parse(raw);
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const envelope = data as Record<string, unknown>;
      const eventType = envelope.event ?? envelope.type ?? envelope.topic;
      if (typeof eventType === 'string' && eventType.trim()) {
        type = eventType.trim();
      }
    }
  } catch {
    // Keep non-JSON messages as raw text events.
  }

  return { type, data, raw, receivedAt: new Date().toISOString() };
};

const notifyListeners = (event: StoredWebSocketEvent): void => {
  eventListeners.forEach((listener) => {
    try {
      listener(event);
    } catch (error) {
      console.warn('[PlanKO Data] WebSocket listener failed:', error);
    }
  });
};

/**
 * Shared persistence and data gateway for API responses and WebSocket events.
 * API requests resolve only after their response has been written to storage.
 * WebSocket subscribers are notified only after the event has been written.
 */
export const dataStorage = {
  async getItem<T>(key: string): Promise<T | null> {
    const raw = await getRawItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      throw new TypeError(`Value for storage key "${key}" is not serializable`);
    }
    await setRawItem(key, serialized);
  },

  async removeItem(key: string): Promise<void> {
    const previousWrite = writeQueues.get(key) ?? Promise.resolve();
    const write = previousWrite.then(async () => {
      await AsyncStorage.removeItem(key);
      memoryStorage.delete(key);
    });
    writeQueues.set(key, write.then(() => undefined, () => undefined));
    await write;
  },

  getApiCache<T>(cacheKey: string): Promise<T | null> {
    return this.getItem<T>(`${API_CACHE_PREFIX}${cacheKey}`);
  },

  async requestApi<T>(
    cacheKey: string,
    request: () => Promise<T>,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    const storageKey = `${API_CACHE_PREFIX}${cacheKey}`;

    try {
      const response = await request();
      await this.setItem(storageKey, response);
      return response;
    } catch (error) {
      if (options.fallbackToCache !== false) {
        const cached = await getRawItem(storageKey);
        if (cached !== null) return JSON.parse(cached) as T;
      }
      throw error;
    }
  },

  requestJson<T>(
    cacheKey: string,
    url: string,
    init?: RequestInit,
    options?: ApiRequestOptions,
  ): Promise<T> {
    return this.requestApi(
      cacheKey,
      async () => {
        const response = await fetch(url, init);
        if (!response.ok) {
          throw new Error(`API request failed (${response.status} ${response.statusText})`);
        }
        return (await response.json()) as T;
      },
      options,
    );
  },

  subscribeToWebSocketEvents(listener: WebSocketListener): () => void {
    eventListeners.add(listener);
    return () => {
      eventListeners.delete(listener);
    };
  },

  receiveWebSocketMessage(raw: string): Promise<StoredWebSocketEvent> {
    const event = parseEvent(raw);
    const operation = websocketEventQueue.then(async () => {
      const latestKey = `${WEBSOCKET_LATEST_PREFIX}${encodeURIComponent(event.type)}`;
      const previousHistory = (await this.getItem<StoredWebSocketEvent[]>(WEBSOCKET_HISTORY_KEY)) ?? [];
      await this.setItem(latestKey, event);
      await this.setItem(
        WEBSOCKET_HISTORY_KEY,
        [...previousHistory, event].slice(-MAX_WEBSOCKET_HISTORY),
      );
      notifyListeners(event);
      return event;
    });

    websocketEventQueue = operation.then(() => undefined, () => undefined);
    return operation;
  },

  connectWebSocket(
    url: string,
    handlers: WebSocketHandlers = {},
    retryDelayMs = 3000,
  ): () => void {
    let active = true;
    let socket: WebSocket | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (!active) return;
      handlers.onStatusChange?.('connecting');

      try {
        socket = new WebSocket(url);
      } catch (error) {
        handlers.onError?.(error);
        handlers.onStatusChange?.('disconnected');
        retryTimer = setTimeout(connect, retryDelayMs);
        return;
      }

      socket.onopen = () => {
        if (active) handlers.onStatusChange?.('connected');
      };

      socket.onmessage = (message) => {
        if (!active) return;
        const raw = typeof message.data === 'string'
          ? message.data
          : JSON.stringify(message.data) ?? String(message.data);
        this.receiveWebSocketMessage(raw).catch((error) => handlers.onError?.(error));
      };

      socket.onerror = (error) => {
        if (!active) return;
        handlers.onError?.(error);
        handlers.onStatusChange?.('disconnected');
      };

      socket.onclose = (event) => {
        if (!active) return;
        console.log(`[PlanKO Data] WebSocket closed (${event.code}); retrying.`);
        handlers.onStatusChange?.('disconnected');
        retryTimer = setTimeout(connect, retryDelayMs);
      };
    };

    connect();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
      socket?.close();
    };
  },
};
