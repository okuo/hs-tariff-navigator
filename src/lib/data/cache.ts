import type { KeyValueStorage } from '../storage';
import type { CachedData } from './types';

export interface DataCache {
  get(): Promise<CachedData | null>;
  set(data: CachedData): Promise<void>;
  clear(): Promise<void>;
}

interface DataCacheOptions {
  key: string;
  expiryHours: number;
  now?: () => number;
}

export function createDataCache(
  storage: KeyValueStorage,
  { key, expiryHours, now = Date.now }: DataCacheOptions
): DataCache {
  const isValid = (cachedAt: string): boolean => {
    const cachedTime = new Date(cachedAt).getTime();
    const expiryMs = expiryHours * 60 * 60 * 1000;
    return Number.isFinite(cachedTime) && now() - cachedTime < expiryMs;
  };

  return {
    async get(): Promise<CachedData | null> {
      try {
        const cached = await storage.get<CachedData>(key);
        return cached && isValid(cached.cached_at) ? cached : null;
      } catch (error) {
        console.error('Failed to get cached data:', error);
        return null;
      }
    },

    async set(data: CachedData): Promise<void> {
      try {
        await storage.set(key, data);
      } catch (error) {
        console.error('Failed to save cached data:', error);
      }
    },

    async clear(): Promise<void> {
      try {
        await storage.remove(key);
      } catch (error) {
        console.error('Failed to clear cached data:', error);
      }
    },
  };
}
