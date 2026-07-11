import { STORAGE_KEYS } from '@/utils/constants';

type InitialStorageValues = Record<string, unknown>;

export function getInitialStorageValues(
  reason: chrome.runtime.OnInstalledReason
): InitialStorageValues | null {
  if (reason !== 'install') {
    return null;
  }

  return {
    [STORAGE_KEYS.USER_SETTINGS]: {
      defaultFromCountry: 'JP',
      defaultToCountry: 'CN',
      language: 'ja',
    },
    [STORAGE_KEYS.SEARCH_HISTORY]: [],
  };
}
