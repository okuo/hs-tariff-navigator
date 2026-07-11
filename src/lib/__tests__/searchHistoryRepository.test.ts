import type { OptimizationResult, SearchHistoryEntry } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import type { KeyValueStorage } from '../storage';
import { createSearchHistoryRepository } from '../searchHistoryRepository';

class MemoryStorage implements KeyValueStorage {
  private readonly values = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    return (this.values.get(key) as T | undefined) ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.values.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.values.delete(key);
  }
}

const result: OptimizationResult = {
  hs_code: '0101.21',
  from_country: 'JP',
  to_country: 'US',
  trade_value: 1000000,
  base_rate: 10,
  base_rate_source: 'actual',
  agreements: [],
};

function createEntry(index: number): SearchHistoryEntry {
  return {
    id: String(index),
    hs_code: '0101.21',
    country_from: 'JP',
    country_to: 'US',
    trade_value: 1000000,
    search_results: result,
    created_at: new Date(2026, 0, index + 1).toISOString(),
  };
}

describe('createSearchHistoryRepository', () => {
  it('Popupで使用してきた履歴キーを正本として維持する', () => {
    expect(STORAGE_KEYS.SEARCH_HISTORY).toBe('tariff-scope-search-history');
  });

  it('新しい履歴を先頭へ追加する', async () => {
    const repository = createSearchHistoryRepository(new MemoryStorage());
    const first = createEntry(1);
    const second = createEntry(2);

    await repository.add(first);
    await repository.add(second);

    await expect(repository.getAll()).resolves.toEqual([second, first]);
  });

  it('履歴を最大50件に制限する', async () => {
    const repository = createSearchHistoryRepository(new MemoryStorage());

    for (let index = 0; index < 51; index += 1) {
      await repository.add(createEntry(index));
    }

    const history = await repository.getAll();
    expect(history).toHaveLength(50);
    expect(history[0].id).toBe('50');
    expect(history[49].id).toBe('1');
  });

  it('保存済み履歴を削除する', async () => {
    const repository = createSearchHistoryRepository(new MemoryStorage());
    await repository.add(createEntry(1));

    await repository.clear();

    await expect(repository.getAll()).resolves.toEqual([]);
  });

  it('旧Backgroundキーの履歴を読み込んで移行する', async () => {
    const storage = new MemoryStorage();
    const legacyEntry = createEntry(1);
    await storage.set('search_history', [legacyEntry]);
    const repository = createSearchHistoryRepository(storage);

    await expect(repository.getAll()).resolves.toEqual([legacyEntry]);
    await expect(storage.get(STORAGE_KEYS.SEARCH_HISTORY)).resolves.toEqual([legacyEntry]);
  });
});
