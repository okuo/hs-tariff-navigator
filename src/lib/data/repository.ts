import type { DataCache } from './cache';
import type { DataSource } from './sources';
import type { CachedData, DataManifest } from './types';

export type RemoteDataSourceFactory = (baseUrl: string) => DataSource;

export function getRemoteBaseUrl(manifest?: DataManifest): string | null {
  if (!manifest?.remote?.enabled) {
    return null;
  }

  const baseUrl = manifest.remote.base_url?.trim();
  return baseUrl ? baseUrl.replace(/\/$/, '') : null;
}

export class DataRepository {
  constructor(
    private readonly bundledSource: DataSource,
    private readonly remoteSourceFactory: RemoteDataSourceFactory,
    private readonly cache: DataCache
  ) {}

  async load(forceRefresh = false): Promise<CachedData> {
    if (!forceRefresh) {
      const cached = await this.cache.get();
      if (cached) {
        return cached;
      }
    }

    const bundledData = await this.bundledSource.load();
    const remoteBaseUrl = getRemoteBaseUrl(bundledData.manifest);
    let selectedData = bundledData;

    if (remoteBaseUrl) {
      try {
        selectedData = await this.remoteSourceFactory(remoteBaseUrl).load();
      } catch (error) {
        console.warn('Remote data unavailable; using bundled data.', error);
      }
    }

    await this.cache.set(selectedData);
    return selectedData;
  }
}
