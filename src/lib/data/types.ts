import type { Agreement, DataSourceType, HSCode, JsonValue } from '@/types';

export interface TariffRateData {
  hs_code: string;
  country_from: string;
  country_to: string;
  agreement_id: string | null;
  base_rate: number;
  preferential_rate: number;
  conditions: Record<string, JsonValue>;
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

export interface VersionedData<T> {
  version: string;
  data: T[];
}
