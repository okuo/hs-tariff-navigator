import type { Agreement, HSCode } from '@/types';
import type { CachedData, DataManifest, TariffRateData, VersionedData } from './types';

export interface DataSource {
  load(): Promise<CachedData>;
}

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

function createJsonDataSource(baseUrl: string, now: () => Date): DataSource {
  const normalizedBaseUrl = trimTrailingSlash(baseUrl);

  return {
    async load(): Promise<CachedData> {
      const manifest = await fetchJson<DataManifest>(`${normalizedBaseUrl}/data-manifest.json`);
      const [hsCodes, agreements, tariffRates] = await Promise.all([
        fetchJson<VersionedData<HSCode>>(`${normalizedBaseUrl}/${manifest.files.hs_codes.url}`),
        fetchJson<VersionedData<Agreement>>(`${normalizedBaseUrl}/${manifest.files.agreements.url}`),
        fetchJson<VersionedData<TariffRateData>>(`${normalizedBaseUrl}/${manifest.files.tariff_rates.url}`),
      ]);

      return {
        hs_codes: hsCodes.data,
        agreements: agreements.data,
        tariff_rates: tariffRates.data,
        manifest,
        cached_at: now().toISOString(),
      };
    },
  };
}

export function createBundledDataSource(baseUrl: string, now = () => new Date()): DataSource {
  return createJsonDataSource(baseUrl, now);
}

export function createRemoteDataSource(baseUrl: string, now = () => new Date()): DataSource {
  return createJsonDataSource(baseUrl, now);
}
