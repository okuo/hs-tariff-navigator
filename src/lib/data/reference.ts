import type { DataReference } from '@/types';
import type { DataManifest, TariffRateData } from './types';

const FALLBACK_SOURCE_NAME = 'TariffScope同梱参考データ';

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
