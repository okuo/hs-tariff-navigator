import { DataService, type CachedData } from '../dataService';

function createData(version: string): CachedData {
  return {
    hs_codes: [],
    agreements: [],
    tariff_rates: [],
    manifest: {
      version,
      updated_at: '2026-07-11T00:00:00.000Z',
      files: {
        hs_codes: { url: 'hs_codes.json', count: 0 },
        agreements: { url: 'agreements.json', count: 0 },
        tariff_rates: { url: 'tariff_rates.json', count: 0 },
      },
    },
    cached_at: '2026-07-11T00:00:00.000Z',
  };
}

describe('DataService lifecycle', () => {
  it('ロード失敗後の呼び出しで再試行できる', async () => {
    const recovered = createData('recovered');
    const loader = jest.fn<Promise<CachedData>, [boolean?]>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(recovered);
    const service = new DataService(loader);

    await expect(service.getData()).rejects.toThrow('offline');
    await expect(service.getData()).resolves.toBe(recovered);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('refreshで取得したデータをメモリに保持する', async () => {
    const initial = createData('initial');
    const refreshed = createData('refreshed');
    const loader = jest.fn<Promise<CachedData>, [boolean?]>()
      .mockResolvedValueOnce(initial)
      .mockResolvedValueOnce(refreshed);
    const service = new DataService(loader);

    await expect(service.getData()).resolves.toBe(initial);
    await expect(service.refresh()).resolves.toBe(refreshed);
    await expect(service.getData()).resolves.toBe(refreshed);
    expect(loader).toHaveBeenCalledTimes(2);
    expect(loader).toHaveBeenNthCalledWith(2, true);
  });

  it('同時呼び出しでは同じロード処理を共有する', async () => {
    const data = createData('shared');
    let resolveLoad: (value: CachedData) => void = () => undefined;
    const loader = jest.fn(() => new Promise<CachedData>((resolve) => {
      resolveLoad = resolve;
    }));
    const service = new DataService(loader);

    const first = service.getData();
    const second = service.getData();
    resolveLoad(data);

    await expect(first).resolves.toBe(data);
    await expect(second).resolves.toBe(data);
    expect(loader).toHaveBeenCalledTimes(1);
  });
});
