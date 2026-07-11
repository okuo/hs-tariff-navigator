import type { SearchHistoryEntry } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { extensionStorage, type KeyValueStorage } from './storage';

const LEGACY_SEARCH_HISTORY_KEY = 'search_history';
const DEFAULT_HISTORY_LIMIT = 50;

export interface SearchHistoryRepository {
  add(entry: SearchHistoryEntry): Promise<void>;
  getAll(): Promise<SearchHistoryEntry[]>;
  clear(): Promise<void>;
}

export function createSearchHistoryRepository(
  storage: KeyValueStorage,
  limit = DEFAULT_HISTORY_LIMIT
): SearchHistoryRepository {
  const getAll = async (): Promise<SearchHistoryEntry[]> => {
    const current = await storage.get<SearchHistoryEntry[]>(STORAGE_KEYS.SEARCH_HISTORY);
    if (current !== null) {
      return current;
    }

    const legacy = await storage.get<SearchHistoryEntry[]>(LEGACY_SEARCH_HISTORY_KEY);
    if (legacy === null) {
      return [];
    }

    await storage.set(STORAGE_KEYS.SEARCH_HISTORY, legacy);
    await storage.remove(LEGACY_SEARCH_HISTORY_KEY);
    return legacy;
  };

  return {
    async add(entry: SearchHistoryEntry): Promise<void> {
      const history = await getAll();
      await storage.set(STORAGE_KEYS.SEARCH_HISTORY, [entry, ...history].slice(0, limit));
    },

    getAll,

    async clear(): Promise<void> {
      await storage.remove(STORAGE_KEYS.SEARCH_HISTORY);
      await storage.remove(LEGACY_SEARCH_HISTORY_KEY);
    },
  };
}

export const searchHistoryRepository = createSearchHistoryRepository(extensionStorage);
