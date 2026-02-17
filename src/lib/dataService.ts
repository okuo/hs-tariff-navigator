/**
 * データ取得・キャッシュ管理サービス
 * 外部JSONファイルからデータを取得し、ローカルにキャッシュする
 */

import type { HSCode, Agreement } from '../types';

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
}

export interface DataManifest {
  version: string;
  updated_at: string;
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
const DATA_BASE_URL = 'https://your-username.github.io/trade-lens-data';
const CACHE_KEY = 'trade-lens-data-cache';
const CACHE_EXPIRY_HOURS = 24;

// 開発環境用のローカルデータパス
const LOCAL_DATA_PATH = chrome?.runtime?.getURL?.('data/') || '/data/';

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
    fetchJson<DataManifest>(`${basePath}manifest.json`),
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
  const manifestUrl = `${baseUrl}/manifest.json`;
  const manifest = await fetchJson<DataManifest>(manifestUrl);

  const [hsCodesData, agreementsData, tariffRatesData] = await Promise.all([
    fetchJson<{ version: string; data: HSCode[] }>(`${baseUrl}/${manifest.files.hs_codes.url}`),
    fetchJson<{ version: string; data: Agreement[] }>(`${baseUrl}/${manifest.files.agreements.url}`),
    fetchJson<{ version: string; data: TariffRateData[] }>(`${baseUrl}/${manifest.files.tariff_rates.url}`),
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
      data = await loadRemoteData(DATA_BASE_URL);
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
export async function checkForUpdates(baseUrl: string = DATA_BASE_URL): Promise<boolean> {
  try {
    const cached = await getCachedData();
    if (!cached) return true;

    const remoteManifest = await fetchJson<DataManifest>(`${baseUrl}/manifest.json`);
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
