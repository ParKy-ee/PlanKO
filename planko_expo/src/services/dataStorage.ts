import AsyncStorage from '@react-native-async-storage/async-storage';

const API_CACHE_PREFIX = '@planko_api:';
export type ApiRequestOptions = { fallbackToCache?: boolean };

const memoryStorage = new Map<string, string>();
const writeQueues = new Map<string, Promise<void>>();

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

/**
 * Shared persistence and API cache for application data.
 * API requests resolve only after their response has been written to storage.
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

};
