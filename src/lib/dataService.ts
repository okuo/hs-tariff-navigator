/**
 * データ取得・キャッシュ管理の互換ファサード
 */

import type { Agreement, HSCode } from '@/types';
import { createDataCache } from './data/cache';
import { DataRepository, getRemoteBaseUrl } from './data/repository';
import { createBundledDataSource, createRemoteDataSource, fetchJson } from './data/sources';
import type { CachedData, DataManifest, TariffRateData } from './data/types';
import { extensionStorage } from './storage';

export type {
  CachedData,
  DataManifest,
  DataManifestCoverage,
  DataManifestRemote,
  DataManifestSource,
  TariffRateData,
} from './data/types';
export { getManifestDataReference, getTariffRateReference } from './data/reference';

const CACHE_KEY = 'tariff-scope-data-cache';
const CACHE_EXPIRY_HOURS = 24;
const LOCAL_DATA_PATH =
  typeof chrome !== 'undefined' && chrome.runtime?.getURL
    ? chrome.runtime.getURL('data/')
    : '/data/';

const dataCache = createDataCache(extensionStorage, {
  key: CACHE_KEY,
  expiryHours: CACHE_EXPIRY_HOURS,
});
const dataRepository = new DataRepository(
  createBundledDataSource(LOCAL_DATA_PATH),
  (baseUrl) => createRemoteDataSource(baseUrl),
  dataCache
);

export async function getCachedData(): Promise<CachedData | null> {
  return dataCache.get();
}

export async function loadData(forceRefresh = false): Promise<CachedData> {
  try {
    return await dataRepository.load(forceRefresh);
  } catch (error) {
    console.error('Failed to load data:', error);
    throw new Error('データの読み込みに失敗しました');
  }
}

export async function checkForUpdates(baseUrl?: string): Promise<boolean> {
  try {
    const cached = await getCachedData();
    if (!cached) return true;

    const explicitBaseUrl = baseUrl?.trim().replace(/\/$/, '');
    const remoteBaseUrl = explicitBaseUrl || getRemoteBaseUrl(cached.manifest);
    if (!remoteBaseUrl) return false;

    const remoteManifest = await fetchJson<DataManifest>(`${remoteBaseUrl}/data-manifest.json`);
    return remoteManifest.version !== cached.manifest.version;
  } catch (error) {
    console.error('Failed to check for updates:', error);
    return false;
  }
}

export async function clearCache(): Promise<void> {
  await dataCache.clear();
}

type DataLoader = (forceRefresh?: boolean) => Promise<CachedData>;

export class DataService {
  private data: CachedData | null = null;
  private loading: Promise<CachedData> | null = null;

  constructor(private readonly loader: DataLoader = loadData) {}

  async getData(): Promise<CachedData> {
    if (this.data) {
      return this.data;
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = this.loader(false);
    try {
      const data = await this.loading;
      this.data = data;
      return data;
    } finally {
      this.loading = null;
    }
  }

  async getHSCodes(): Promise<HSCode[]> {
    const data = await this.getData();
    return data.hs_codes;
  }

  async getAgreements(): Promise<Agreement[]> {
    const data = await this.getData();
    return data.agreements;
  }

  async getTariffRates(): Promise<TariffRateData[]> {
    const data = await this.getData();
    return data.tariff_rates;
  }

  async refresh(): Promise<CachedData> {
    this.data = null;
    this.loading = null;
    const data = await this.loader(true);
    this.data = data;
    return data;
  }
}

export const dataService = new DataService();
export default dataService;
