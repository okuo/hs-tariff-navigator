import { resetChromeStorage, setChromeStorageData } from '../../test/mocks/chrome';
import { getCachedData, clearCache } from '../dataService';

// Set up Chrome mocks before importing modules that use chrome APIs
beforeEach(() => {
  resetChromeStorage();
});

const CACHE_KEY = 'tariff-scope-data-cache';

const validCachedData = {
  hs_codes: [
    {
      code: '0101.21',
      description_ja: '馬',
      description_en: 'Horses',
      unit: 'NO',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ],
  agreements: [],
  tariff_rates: [],
  manifest: {
    version: '1.0.0',
    updated_at: '2024-01-01',
    files: {
      hs_codes: { url: 'hs_codes.json', count: 1 },
      agreements: { url: 'agreements.json', count: 0 },
      tariff_rates: { url: 'tariff_rates.json', count: 0 },
    },
  },
  cached_at: new Date().toISOString(), // current time = valid cache
};

const expiredCachedData = {
  ...validCachedData,
  cached_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago = expired
};

describe('getCachedData', () => {
  it('should return cached data when cache is valid', async () => {
    setChromeStorageData({ [CACHE_KEY]: validCachedData });

    const result = await getCachedData();
    expect(result).not.toBeNull();
    expect(result!.hs_codes).toHaveLength(1);
    expect(result!.hs_codes[0].code).toBe('0101.21');
  });

  it('should return null when cache is expired', async () => {
    setChromeStorageData({ [CACHE_KEY]: expiredCachedData });

    const result = await getCachedData();
    expect(result).toBeNull();
  });

  it('should return null when no cache exists', async () => {
    const result = await getCachedData();
    expect(result).toBeNull();
  });

  it('should call chrome.storage.local.get with correct key', async () => {
    await getCachedData();
    expect(chrome.storage.local.get).toHaveBeenCalledWith(
      [CACHE_KEY],
      expect.any(Function)
    );
  });
});

describe('clearCache', () => {
  it('should call chrome.storage.local.remove with correct key', async () => {
    await clearCache();
    expect(chrome.storage.local.remove).toHaveBeenCalledWith([CACHE_KEY]);
  });

  it('should remove cached data', async () => {
    setChromeStorageData({ [CACHE_KEY]: validCachedData });

    await clearCache();

    const result = await getCachedData();
    expect(result).toBeNull();
  });
});
