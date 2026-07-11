import type { CachedData, DataManifest } from '../data/types';
import type { DataCache } from '../data/cache';
import { DataRepository } from '../data/repository';
import type { DataSource } from '../data/sources';

function createManifest(remote?: DataManifest['remote']): DataManifest {
  return {
    version: '1.0.0',
    updated_at: '2026-07-11T00:00:00.000Z',
    remote,
    files: {
      hs_codes: { url: 'hs_codes.json', count: 0 },
      agreements: { url: 'agreements.json', count: 0 },
      tariff_rates: { url: 'tariff_rates.json', count: 0 },
    },
  };
}

function createData(version: string, remote?: DataManifest['remote']): CachedData {
  return {
    hs_codes: [],
    agreements: [],
    tariff_rates: [],
    manifest: { ...createManifest(remote), version },
    cached_at: '2026-07-11T00:00:00.000Z',
  };
}

class MemoryCache implements DataCache {
  stored: CachedData | null;
  saved: CachedData[] = [];

  constructor(initial: CachedData | null = null) {
    this.stored = initial;
  }

  async get(): Promise<CachedData | null> {
    return this.stored;
  }

  async set(data: CachedData): Promise<void> {
    this.stored = data;
    this.saved.push(data);
  }

  async clear(): Promise<void> {
    this.stored = null;
  }
}

function createSource(load: () => Promise<CachedData>): DataSource {
  return { load };
}

describe('DataRepository', () => {
  it('有効なキャッシュがあればデータソースを呼ばない', async () => {
    const cached = createData('cached');
    const cache = new MemoryCache(cached);
    const bundledLoad = jest.fn<Promise<CachedData>, []>();
    const repository = new DataRepository(
      createSource(bundledLoad),
      jest.fn(),
      cache
    );

    await expect(repository.load()).resolves.toBe(cached);
    expect(bundledLoad).not.toHaveBeenCalled();
  });

  it('リモート更新が有効ならリモートデータを優先する', async () => {
    const bundled = createData('bundled', {
      enabled: true,
      base_url: 'https://data.example.com/',
    });
    const remote = createData('remote');
    const cache = new MemoryCache();
    const remoteLoad = jest.fn(async () => remote);
    const remoteFactory = jest.fn(() => createSource(remoteLoad));
    const repository = new DataRepository(
      createSource(async () => bundled),
      remoteFactory,
      cache
    );

    await expect(repository.load(true)).resolves.toBe(remote);
    expect(remoteFactory).toHaveBeenCalledWith('https://data.example.com');
    expect(cache.saved).toEqual([remote]);
  });

  it('リモート取得に失敗した場合は同梱データへフォールバックする', async () => {
    const bundled = createData('bundled', {
      enabled: true,
      base_url: 'https://data.example.com',
    });
    const cache = new MemoryCache();
    const warning = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const repository = new DataRepository(
      createSource(async () => bundled),
      () => createSource(async () => {
        throw new Error('offline');
      }),
      cache
    );

    await expect(repository.load(true)).resolves.toBe(bundled);
    expect(cache.saved).toEqual([bundled]);
    expect(warning).toHaveBeenCalled();
    warning.mockRestore();
  });
});
