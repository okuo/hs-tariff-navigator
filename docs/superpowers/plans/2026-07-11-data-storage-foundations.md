# Data and Storage Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** データ更新、キャッシュ、検索履歴をテスト可能な共有境界へ分離し、既存 UI と関税計算の動作を維持する。

**Architecture:** `KeyValueStorage` と `SearchHistoryRepository` を Popup／Background の共通基盤にする。データ層を型、参照変換、取得元、キャッシュ、リポジトリへ分割し、`dataService.ts` は互換ファサードとして残す。

**Tech Stack:** TypeScript 5、Chrome Extension Manifest V3、Jest 30、Webpack 5

## Global Constraints

- 新しい実行時依存パッケージを追加しない。
- `src/lib/dataService.ts` の既存 export と関税計算結果を維持する。
- リモート更新は有効時のみ試し、失敗時は同梱データへフォールバックする。
- 検索履歴は `SearchHistoryEntry` と `created_at` に統一し、最大50件とする。
- 元作業ツリーの未コミット UI／Chrome AI 変更には触れない。

---

### Task 1: 共有ストレージアダプター

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/lib/__tests__/storage.test.ts`

**Interfaces:**
- Produces: `KeyValueStorage`、`createExtensionStorage()`、`extensionStorage`
- `get<T>(key: string): Promise<T | null>`
- `set<T>(key: string, value: T): Promise<void>`
- `remove(key: string): Promise<void>`

- [x] **Step 1: Chrome Storage と localStorage の期待動作を表す失敗テストを書く**

```ts
const storage = createExtensionStorage();
await storage.set('sample', { value: 1 });
await expect(storage.get<{ value: number }>('sample')).resolves.toEqual({ value: 1 });
await storage.remove('sample');
await expect(storage.get('sample')).resolves.toBeNull();
```

- [x] **Step 2: テストを実行し、モジュール未定義で失敗することを確認する**

Run: `npm test -- --runInBand src/lib/__tests__/storage.test.ts`
Expected: FAIL with `Cannot find module '../storage'`.

- [x] **Step 3: 最小の型付きアダプターを実装する**

```ts
export interface KeyValueStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export function createExtensionStorage(): KeyValueStorage {
  return {
    async get<T>(key: string) {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        const result = await chrome.storage.local.get([key]);
        return (result[key] as T | undefined) ?? null;
      }
      const stored = localStorage.getItem(key);
      return stored === null ? null : JSON.parse(stored) as T;
    },
    async set<T>(key: string, value: T) {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.set({ [key]: value });
        return;
      }
      localStorage.setItem(key, JSON.stringify(value));
    },
    async remove(key: string) {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.remove([key]);
        return;
      }
      localStorage.removeItem(key);
    },
  };
}
```

- [x] **Step 4: 対象テストを再実行して成功を確認する**

Run: `npm test -- --runInBand src/lib/__tests__/storage.test.ts`
Expected: PASS.

### Task 2: 検索履歴リポジトリ

**Files:**
- Create: `src/lib/searchHistoryRepository.ts`
- Create: `src/lib/__tests__/searchHistoryRepository.test.ts`
- Modify: `src/lib/api.ts`
- Modify: `src/background/index.ts`

**Interfaces:**
- Consumes: `KeyValueStorage`、`SearchHistoryEntry`
- Produces: `createSearchHistoryRepository(storage, options?)`
- `add(entry: SearchHistoryEntry): Promise<void>`
- `getAll(): Promise<SearchHistoryEntry[]>`
- `clear(): Promise<void>`

- [x] **Step 1: 新しい履歴を先頭へ追加し最大50件に切る失敗テストを書く**

```ts
const repository = createSearchHistoryRepository(memoryStorage);
await repository.add(entry);
expect(await repository.getAll()).toEqual([entry]);
```

- [x] **Step 2: 対象テストがモジュール未定義で失敗することを確認する**

Run: `npm test -- --runInBand src/lib/__tests__/searchHistoryRepository.test.ts`
Expected: FAIL with `Cannot find module '../searchHistoryRepository'`.

- [x] **Step 3: リポジトリを実装し、API と Background の重複処理を置き換える**

```ts
export function createSearchHistoryRepository(storage: KeyValueStorage, limit = 50) {
  return {
    async add(entry: SearchHistoryEntry) {
      const history = await this.getAll();
      await storage.set(STORAGE_KEYS.SEARCH_HISTORY, [entry, ...history].slice(0, limit));
    },
    async getAll() { return (await storage.get<SearchHistoryEntry[]>(STORAGE_KEYS.SEARCH_HISTORY)) ?? []; },
    async clear() { await storage.remove(STORAGE_KEYS.SEARCH_HISTORY); },
  };
}
```

- [x] **Step 4: 履歴テスト、API関連テスト、型チェックを実行する**

Run: `npm test -- --runInBand src/lib/__tests__/searchHistoryRepository.test.ts && npm run type-check`
Expected: PASS and exit 0.

### Task 3: データ契約と取得元の分離

**Files:**
- Create: `src/lib/data/types.ts`
- Create: `src/lib/data/reference.ts`
- Create: `src/lib/data/cache.ts`
- Create: `src/lib/data/sources.ts`
- Create: `src/lib/data/repository.ts`
- Create: `src/lib/__tests__/dataRepository.test.ts`
- Modify: `src/types/index.ts`
- Modify: `src/lib/dataService.ts`
- Modify: `src/lib/tariffOptimizer.ts`

**Interfaces:**
- Produces: `DataManifest`、`TariffRateData`、`CachedData`
- Produces: `DataSource.load(): Promise<CachedData>`
- Produces: `DataCache.get()/set()/clear()`
- Produces: `DataRepository.load(forceRefresh?: boolean): Promise<CachedData>`

- [x] **Step 1: キャッシュ優先、リモート優先、同梱フォールバックの失敗テストを書く**

```ts
await expect(repository.load()).resolves.toBe(cachedData);
await expect(remoteEnabledRepository.load(true)).resolves.toBe(remoteData);
remoteSource.load.mockRejectedValue(new Error('offline'));
await expect(remoteEnabledRepository.load(true)).resolves.toBe(bundledData);
```

- [x] **Step 2: テストがリポジトリ未定義で失敗することを確認する**

Run: `npm test -- --runInBand src/lib/__tests__/dataRepository.test.ts`
Expected: FAIL with `Cannot find module '../data/repository'`.

- [x] **Step 3: データ層を分離し `dataService.ts` から互換 export する**

```ts
export class DataRepository {
  constructor(
    private readonly bundled: DataSource,
    private readonly remoteFactory: (baseUrl: string) => DataSource,
    private readonly cache: DataCache
  ) {}

  async load(forceRefresh = false): Promise<CachedData> {
    if (!forceRefresh) {
      const cached = await this.cache.get();
      if (cached) return cached;
    }
    const bundled = await this.bundled.load();
    const remoteBaseUrl = getRemoteBaseUrl(bundled.manifest);
    let selected = bundled;
    if (remoteBaseUrl) {
      try {
        selected = await this.remoteFactory(remoteBaseUrl).load();
      } catch (error) {
        console.warn('Remote data unavailable; using bundled data.', error);
      }
    }
    await this.cache.set(selected);
    return selected;
  }
}
```

- [x] **Step 4: データリポジトリと既存 optimizer テストを実行する**

Run: `npm test -- --runInBand src/lib/__tests__/dataRepository.test.ts src/lib/__tests__/tariffOptimizer.test.ts`
Expected: PASS.

### Task 4: DataService の失敗復旧と refresh

**Files:**
- Create: `src/lib/__tests__/dataServiceLifecycle.test.ts`
- Modify: `src/lib/dataService.ts`

**Interfaces:**
- Produces: export class `DataService`
- Constructor consumes: `(loader?: (forceRefresh?: boolean) => Promise<CachedData>)`

- [x] **Step 1: refresh のメモリ保持と失敗後再試行の失敗テストを書く**

```ts
await expect(service.getData()).rejects.toThrow('offline');
await expect(service.getData()).resolves.toBe(data);
await service.refresh();
await service.getData();
expect(loader).toHaveBeenCalledTimes(3);
```

- [x] **Step 2: 現実装で期待どおり失敗することを確認する**

Run: `npm test -- --runInBand src/lib/__tests__/dataServiceLifecycle.test.ts`
Expected: FAIL because rejected `loading` is retained and refresh result is not assigned.

- [x] **Step 3: `try/finally` と refresh 代入を最小実装する**

```ts
this.loading = this.loader(false);
try {
  this.data = await this.loading;
  return this.data;
} finally {
  this.loading = null;
}
```

- [x] **Step 4: ライフサイクルテストと既存データサービステストを実行する**

Run: `npm test -- --runInBand src/lib/__tests__/dataServiceLifecycle.test.ts src/lib/__tests__/dataService.test.ts`
Expected: PASS.

### Task 5: 型付き Background メッセージと全体検証

**Files:**
- Create: `src/types/messages.ts`
- Modify: `src/background/index.ts`
- Modify: `src/types/index.ts`
- Modify: `src/lib/search.ts`

**Interfaces:**
- Produces: `ExtensionMessage` discriminated union
- Produces: `JsonValue` used by tariff condition records

- [x] **Step 1: メッセージ union とカテゴリ型を追加し、Background の `any` を除去する**

```ts
export type ExtensionMessage =
  | { type: 'GET_CURRENT_URL' }
  | { type: 'HS_CODE_CLICKED'; hsCode: string; url?: string; context?: string | null }
  | { type: 'SAVE_SEARCH_HISTORY'; data: SearchHistoryEntry }
  | { type: 'GET_SEARCH_HISTORY' }
  | { type: 'CHECK_DATA_UPDATES' }
  | { type: 'REFRESH_DATA' };
```

- [x] **Step 2: 型チェックと lint を実行する**

Run: `npm run type-check && npm run lint`
Expected: type-check exit 0; no production `no-explicit-any` warnings in the modified scope.

- [x] **Step 3: 全テストを実行する**

Run: `npm test -- --runInBand`
Expected: all suites pass with 0 failures.

- [x] **Step 4: production build を実行する**

Run: `npm run build`
Expected: webpack exits 0 and writes `dist/`.

- [x] **Step 5: 差分を確認してコミットする**

```bash
git diff --check
git status --short
git add docs/superpowers src
git commit -m "refactor: データとストレージ基盤を分離"
```
