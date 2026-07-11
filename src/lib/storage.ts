export interface KeyValueStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

function hasChromeStorage(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.local);
}

export function createExtensionStorage(): KeyValueStorage {
  return {
    async get<T>(key: string): Promise<T | null> {
      if (hasChromeStorage()) {
        return new Promise<T | null>((resolve, reject) => {
          chrome.storage.local.get([key], (result) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }
            resolve((result[key] as T | undefined) ?? null);
          });
        });
      }

      const stored = localStorage.getItem(key);
      return stored === null ? null : JSON.parse(stored) as T;
    },

    async set<T>(key: string, value: T): Promise<void> {
      if (hasChromeStorage()) {
        await chrome.storage.local.set({ [key]: value });
        return;
      }

      localStorage.setItem(key, JSON.stringify(value));
    },

    async remove(key: string): Promise<void> {
      if (hasChromeStorage()) {
        await chrome.storage.local.remove([key]);
        return;
      }

      localStorage.removeItem(key);
    },
  };
}

export const extensionStorage = createExtensionStorage();
