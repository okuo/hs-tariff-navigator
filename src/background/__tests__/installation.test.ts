import { STORAGE_KEYS } from '@/utils/constants';
import { getInitialStorageValues } from '../installation';

describe('getInitialStorageValues', () => {
  it('初回インストール時だけ既定値を返す', () => {
    expect(getInitialStorageValues('install' as chrome.runtime.OnInstalledReason)).toEqual({
      [STORAGE_KEYS.USER_SETTINGS]: {
        defaultFromCountry: 'JP',
        defaultToCountry: 'CN',
        language: 'ja',
      },
      [STORAGE_KEYS.SEARCH_HISTORY]: [],
    });
  });

  it('拡張機能更新時は既存ストレージを上書きしない', () => {
    expect(getInitialStorageValues('update' as chrome.runtime.OnInstalledReason)).toBeNull();
    expect(getInitialStorageValues('chrome_update' as chrome.runtime.OnInstalledReason)).toBeNull();
  });
});
