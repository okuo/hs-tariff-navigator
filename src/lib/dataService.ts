/**
 * データ取得・キャッシュ管理サービス
 * 外部JSONファイルからデータを取得し、ローカルにキャッシュする
 */

import type { HSCode, Agreement, DataReference, DataSourceType } from '../types';

// 型定義
export interface TariffRateData {
  hs_code: string;
  country_from: string;
  country_to: string;
  agreement_id: string | null;
  base_rate: number;
  preferential_rate: number;
  conditions: Record<string, any>;
  effective_date: string;
  effective_from?: string;
  effective_to?: string;
  source_name?: string;
  source_url?: string;
  source_note?: string;
  last_verified_at?: string;
}

export interface DataManifestSource {
  type?: DataSourceType;
  name?: string;
  url?: string;
  note?: string;
  last_verified_at?: string;
}

export interface DataManifestCoverage {
  effective_from?: string;
  effective_to?: string;
}

export interface DataManifestRemote {
  enabled?: boolean;
  base_url?: string;
}

export interface DataManifest {
  version: string;
  updated_at: string;
  source?: DataManifestSource;
  coverage?: DataManifestCoverage;
  remote?: DataManifestRemote;
  files: {
    hs_codes: { url: string; count: number };
    agreements: { url: string; count: number };
    tariff_rates: { url: string; count: number };
  };
}

export interface CachedData {
  hs_codes: HSCode[];
  agreements: Agreement[];
  tariff_rates: TariffRateData[];
  manifest: DataManifest;
  cached_at: string;
}

// 設定
const DATA_BASE_URL = '';
const CACHE_KEY = 'tariff-scope-data-cache';
const CACHE_EXPIRY_HOURS = 24;
const FALLBACK_SOURCE_NAME = 'TariffScope同梱参考データ';

// 開発環境用のローカルデータパス
const LOCAL_DATA_PATH =
  typeof chrome !== 'undefined' && chrome.runtime?.getURL
    ? chrome.runtime.getURL('data/')
    : '/data/';

function normalizeBaseUrl(baseUrl?: string): string | null {
  const trimmed = baseUrl?.trim();
  return trimmed ? trimmed.replace(/\/$/, '') : null;
}

function getConfiguredRemoteBaseUrl(manifest?: DataManifest): string | null {
  if (manifest?.remote?.enabled) {
    return normalizeBaseUrl(manifest.remote.base_url);
  }
  return normalizeBaseUrl(DATA_BASE_URL);
}

export function getManifestDataReference(manifest?: DataManifest): DataReference {
  return {
    source_name: manifest?.source?.name ?? FALLBACK_SOURCE_NAME,
    source_url: manifest?.source?.url,
    source_note: manifest?.source?.note,
    last_verified_at: manifest?.source?.last_verified_at ?? manifest?.updated_at,
    effective_from: manifest?.coverage?.effective_from,
    effective_to: manifest?.coverage?.effective_to,
  };
}

export function getTariffRateReference(
  tariffRate: TariffRateData | undefined,
  manifest?: DataManifest
): DataReference {
  const manifestReference = getManifestDataReference(manifest);

  return {
    ...manifestReference,
    source_name: tariffRate?.source_name ?? manifestReference.source_name,
    source_url: tariffRate?.source_url ?? manifestReference.source_url,
    source_note: tariffRate?.source_note ?? manifestReference.source_note,
    last_verified_at: tariffRate?.last_verified_at ?? manifestReference.last_verified_at,
    effective_from: tariffRate?.effective_from ?? tariffRate?.effective_date ?? manifestReference.effective_from,
    effective_to: tariffRate?.effective_to ?? manifestReference.effective_to,
  };
}

/**
 * キャッシュが有効かどうかを確認
 */
function isCacheValid(cachedAt: string): boolean {
  const cacheTime = new Date(cachedAt).getTime();
  const now = Date.now();
  const expiryMs = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
  return (now - cacheTime) < expiryMs;
}

/**
 * キャッシュからデータを取得
 */
export async function getCachedData(): Promise<CachedData | null> {
  try {
    // Chrome Storage APIを使用（拡張機能環境）
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([CACHE_KEY], (result) => {
          const cached = result[CACHE_KEY] as CachedData | undefined;
          if (cached && isCacheValid(cached.cached_at)) {
            resolve(cached);
          } else {
            resolve(null);
          }
        });
      });
    }

    // フォールバック: localStorage
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached) as CachedData;
      if (isCacheValid(data.cached_at)) {
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to get cached data:', error);
    return null;
  }
}

/**
 * データをキャッシュに保存
 */
async function saveToCache(data: CachedData): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [CACHE_KEY]: data });
    } else {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }
  } catch (error) {
    console.error('Failed to save to cache:', error);
  }
}

/**
 * JSONファイルを取得
 */
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

/**
 * ローカルデータを読み込む（開発環境・初回ロード用）
 */
async function loadLocalData(): Promise<CachedData> {
  const basePath = LOCAL_DATA_PATH;

  const [manifestData, hsCodesData, agreementsData, tariffRatesData] = await Promise.all([
    fetchJson<DataManifest>(`${basePath}data-manifest.json`),
    fetchJson<{ version: string; data: HSCode[] }>(`${basePath}hs_codes.json`),
    fetchJson<{ version: string; data: Agreement[] }>(`${basePath}agreements.json`),
    fetchJson<{ version: string; data: TariffRateData[] }>(`${basePath}tariff_rates.json`),
  ]);

  return {
    hs_codes: hsCodesData.data,
    agreements: agreementsData.data,
    tariff_rates: tariffRatesData.data,
    manifest: manifestData,
    cached_at: new Date().toISOString(),
  };
}

/**
 * 外部URLからデータを読み込む
 */
async function loadRemoteData(baseUrl: string): Promise<CachedData> {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  if (!normalizedBaseUrl) {
    throw new Error('Remote data URL is not configured');
  }

  const manifestUrl = `${normalizedBaseUrl}/data-manifest.json`;
  const manifest = await fetchJson<DataManifest>(manifestUrl);

  const [hsCodesData, agreementsData, tariffRatesData] = await Promise.all([
    fetchJson<{ version: string; data: HSCode[] }>(`${normalizedBaseUrl}/${manifest.files.hs_codes.url}`),
    fetchJson<{ version: string; data: Agreement[] }>(`${normalizedBaseUrl}/${manifest.files.agreements.url}`),
    fetchJson<{ version: string; data: TariffRateData[] }>(`${normalizedBaseUrl}/${manifest.files.tariff_rates.url}`),
  ]);

  return {
    hs_codes: hsCodesData.data,
    agreements: agreementsData.data,
    tariff_rates: tariffRatesData.data,
    manifest,
    cached_at: new Date().toISOString(),
  };
}

/**
 * データを読み込む（キャッシュ優先）
 */
export async function loadData(forceRefresh = false): Promise<CachedData> {
  // キャッシュを確認
  if (!forceRefresh) {
    const cached = await getCachedData();
    if (cached) {
      console.log('Using cached data');
      return cached;
    }
  }

  // 新しいデータを取得
  let data: CachedData;

  try {
    // まずローカルデータを試す（拡張機能に同梱されたデータ）
    data = await loadLocalData();
    console.log('Loaded local data');
  } catch (localError) {
    console.log('Local data not available, trying remote...');
    try {
      // 外部URLからデータを取得
      const remoteBaseUrl = getConfiguredRemoteBaseUrl();
      if (!remoteBaseUrl) {
        throw new Error('Remote data URL is not configured');
      }
      data = await loadRemoteData(remoteBaseUrl);
      console.log('Loaded remote data');
    } catch (remoteError) {
      console.error('Failed to load data:', remoteError);
      throw new Error('データの読み込みに失敗しました');
    }
  }

  // キャッシュに保存
  await saveToCache(data);

  return data;
}

/**
 * マニフェストをチェックして更新が必要か確認
 */
export async function checkForUpdates(baseUrl?: string): Promise<boolean> {
  try {
    const cached = await getCachedData();
    if (!cached) return true;

    const remoteBaseUrl = normalizeBaseUrl(baseUrl) ?? getConfiguredRemoteBaseUrl(cached.manifest);
    if (!remoteBaseUrl) return false;

    const remoteManifest = await fetchJson<DataManifest>(`${remoteBaseUrl}/data-manifest.json`);
    return remoteManifest.version !== cached.manifest.version;
  } catch (error) {
    console.error('Failed to check for updates:', error);
    return false;
  }
}

/**
 * キャッシュをクリア
 */
export async function clearCache(): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.remove([CACHE_KEY]);
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

/**
 * データサービスのシングルトンインスタンス
 */
class DataService {
  private data: CachedData | null = null;
  private loading: Promise<CachedData> | null = null;

  async getData(): Promise<CachedData> {
    if (this.data) {
      return this.data;
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = loadData().then((data) => {
      this.data = data;
      this.loading = null;
      return data;
    });

    return this.loading;
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
    return loadData(true);
  }
}

export const dataService = new DataService();
export default dataService;
