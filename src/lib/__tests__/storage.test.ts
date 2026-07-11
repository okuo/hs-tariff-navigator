import { resetChromeStorage } from '../../test/mocks/chrome';
import { createExtensionStorage } from '../storage';

describe('createExtensionStorage', () => {
  beforeEach(() => {
    resetChromeStorage();
    localStorage.clear();
  });

  it('Chrome Storageで値を保存・取得・削除できる', async () => {
    const storage = createExtensionStorage();

    await storage.set('sample', { value: 1 });
    await expect(storage.get<{ value: number }>('sample')).resolves.toEqual({ value: 1 });

    await storage.remove('sample');
    await expect(storage.get('sample')).resolves.toBeNull();
  });

  it('Chrome APIがない環境ではlocalStorageを使用する', async () => {
    const originalChrome = globalThis.chrome;
    Reflect.deleteProperty(globalThis, 'chrome');

    try {
      const storage = createExtensionStorage();
      await storage.set('sample', { value: 2 });

      await expect(storage.get<{ value: number }>('sample')).resolves.toEqual({ value: 2 });
      await storage.remove('sample');
      await expect(storage.get('sample')).resolves.toBeNull();
    } finally {
      globalThis.chrome = originalChrome;
    }
  });
});
