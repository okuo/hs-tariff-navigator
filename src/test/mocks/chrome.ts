/**
 * Chrome Extension API mocks for testing
 */

const storageData: Record<string, any> = {};

const chromeStorageLocal = {
  get: jest.fn((keys: string[], callback: (result: Record<string, any>) => void) => {
    const result: Record<string, any> = {};
    keys.forEach((key) => {
      if (storageData[key] !== undefined) {
        result[key] = storageData[key];
      }
    });
    callback(result);
  }),
  set: jest.fn((items: Record<string, any>) => {
    Object.assign(storageData, items);
    return Promise.resolve();
  }),
  remove: jest.fn((keys: string[]) => {
    keys.forEach((key) => {
      delete storageData[key];
    });
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(storageData).forEach((key) => delete storageData[key]);
    return Promise.resolve();
  }),
};

const chromeMock = {
  storage: {
    local: chromeStorageLocal,
  },
  runtime: {
    getURL: jest.fn((path: string) => `chrome-extension://mock-id/${path}`),
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    lastError: null,
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
    create: jest.fn(),
  },
};

// Assign to global
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).chrome = chromeMock;

/**
 * Reset all mock storage data
 */
export function resetChromeStorage(): void {
  Object.keys(storageData).forEach((key) => delete storageData[key]);
  chromeStorageLocal.get.mockClear();
  chromeStorageLocal.set.mockClear();
  chromeStorageLocal.remove.mockClear();
}

/**
 * Set data directly into mock storage
 */
export function setChromeStorageData(data: Record<string, any>): void {
  Object.assign(storageData, data);
}

export { chromeMock };
