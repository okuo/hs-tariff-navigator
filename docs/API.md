# TariffScope API ドキュメント

TariffScopeで使用されるデータ構造とAPI関数の詳細ドキュメントです。

## データアーキテクチャ

TariffScopeはローカルデータ方式を採用しています。拡張機能に同梱されたJSONファイルからデータを読み込み、Chrome Storage APIにキャッシュします。

### データフロー

```
JSONファイル (public/data/)
  -> dataService (fetch + キャッシュ)
  -> search / tariffOptimizer (ロジック)
  -> api.ts (統合インターフェース)
  -> Reactコンポーネント
```

### データファイル

| ファイル | 説明 |
|---------|------|
| `public/data/manifest.json` | データバージョン・メタ情報 |
| `public/data/hs_codes.json` | HSコードマスター |
| `public/data/agreements.json` | FTA/EPA協定マスター |
| `public/data/tariff_rates.json` | 関税率データ |
| `public/data/origin_rules.json` | 原産地規則データ |

## データ構造

### `HSCode` - HSコードマスター

```typescript
interface HSCode {
  code: string;           // HSコード (10桁)
  description_ja: string; // 日本語品目名
  description_en: string; // 英語品目名
  unit: string;           // 単位 (NO, KG, LT等)
  created_at: string;     // 作成日時
  updated_at: string;     // 更新日時
}
```

### `Agreement` - FTA/EPA協定マスター

```typescript
interface Agreement {
  id: string;             // 協定ID (例: rcep, cptpp)
  name_ja: string;        // 日本語協定名
  name_en: string;        // 英語協定名
  countries: string[];    // 対象国リスト
  effective_date: string; // 発効日
  document_url: string;   // 協定文書URL
  priority: number;       // 優先順位 (数字が小さいほど高優先)
  is_active: boolean;     // 有効フラグ
}
```

### `TariffRate` - 関税率データ

```typescript
interface TariffRateData {
  hs_code: string;                    // HSコード
  country_from: string;               // 輸出国コード
  country_to: string;                 // 輸入国コード
  agreement_id: string | null;        // 協定ID (NULLはMFN関税)
  base_rate: number;                  // 基本関税率 (%)
  preferential_rate: number;          // 協定関税率 (%)
  conditions: Record<string, any>;    // 適用条件
  effective_date: string;             // 発効日
}
```

### `OptimizationResult` - 最適化結果

```typescript
interface OptimizationResult {
  hs_code: string;              // HSコード
  from_country: string;         // 輸出国コード
  to_country: string;           // 輸入国コード
  trade_value: number;          // 貿易金額
  base_rate: number;            // MFN基本関税率 (%)
  agreements: AgreementRate[];  // 利用可能協定一覧
  best_agreement?: AgreementRate; // 最適協定
}

interface AgreementRate {
  agreement: Agreement;           // 協定情報
  rate: number;                   // 協定関税率 (%)
  savings_amount: number;         // 削減金額 (円)
  savings_percentage: number;     // 削減率 (%)
  conditions?: Record<string, any> | null; // 適用条件
}
```

## API関数

### `searchHSCodes` - HSコード検索

日本語・英語の品目名やHSコード番号からHSコードを検索します。3-gram類似度検索を使用。

```typescript
async function searchHSCodes(
  searchTerm: string,
  limit?: number           // 取得件数上限 (デフォルト: 10)
): Promise<HSCode[]>
```

#### 使用例

```typescript
import { searchHSCodes } from '@/lib/api';

const results = await searchHSCodes('電池', 5);
// [
//   {
//     code: '8507100000',
//     description_ja: '鉛蓄電池（起動用）',
//     description_en: 'Lead-acid accumulators for starting piston engines',
//     unit: 'NO',
//     ...
//   },
//   ...
// ]
```

### `optimizeTariff` - 関税最適化

指定されたHSコードと貿易ルートに対して最適なFTA/EPA協定を算出します。

```typescript
async function optimizeTariff(
  hsCode: string,
  fromCountry: string,
  toCountry: string,
  tradeValue?: number        // 貿易金額（円）
): Promise<OptimizationResult>
```

#### 使用例

```typescript
import { optimizeTariff } from '@/lib/api';

const result = await optimizeTariff('8507100000', 'JP', 'CN', 1000000);
// {
//   hs_code: '8507100000',
//   from_country: 'JP',
//   to_country: 'CN',
//   base_rate: 10.0,
//   trade_value: 1000000,
//   agreements: [...],
//   best_agreement: {
//     agreement: {
//       id: 'rcep',
//       name_ja: 'RCEP（地域的な包括的経済連携）',
//       ...
//     },
//     rate: 0.0,
//     savings_amount: 100000,
//     savings_percentage: 100.0,
//     conditions: { origin_requirement: '原産地証明書が必要' }
//   }
// }
```

### `saveSearchHistory` - 検索履歴保存

```typescript
async function saveSearchHistory(
  hsCode: string,
  fromCountry: string,
  toCountry: string,
  tradeValue: number | null,
  searchResults: OptimizationResult
): Promise<void>
```

### `getSearchHistory` - 検索履歴取得

```typescript
async function getSearchHistory(): Promise<SearchHistoryForDisplay[]>
```

### `clearSearchHistory` - 検索履歴クリア

```typescript
async function clearSearchHistory(): Promise<void>
```

### `initializeData` - データ初期化

拡張機能起動時にデータをロードします。

```typescript
async function initializeData(): Promise<void>
```

### `refreshData` - データ更新

キャッシュをクリアして最新データを再取得します。

```typescript
async function refreshData(): Promise<void>
```

## ストレージ

### Chrome Storage API

検索履歴とキャッシュデータはChrome Storage API (`chrome.storage.local`) に保存されます。非拡張環境（開発時）ではlocalStorageにフォールバックします。

| キー | 内容 |
|-----|------|
| `tariff-scope-search-history` | 検索履歴（最大50件） |
| `tariff-scope-data-cache` | HSコード・協定・関税率のキャッシュ |
| `search_history` | Background Scriptが管理する検索履歴 |
| `user_settings` | ユーザー設定 |

### キャッシュ戦略

- データはChrome Storage APIにキャッシュ（有効期限: 24時間）
- 静的データ（協定情報等）は定期的にバックグラウンドで更新チェック
- ネットワークエラー時はキャッシュデータを優先利用

## テスト用データ

以下はテスト用のサンプルデータです。

```typescript
// HSコード検索テスト
const testSearches = [
  '電池',        // 複数結果
  '8507100000',  // 完全一致
  'battery',     // 英語検索
  'smartphone'   // 部分一致
];

// 関税最適化テスト
const testOptimizations = [
  { hs: '8507100000', from: 'JP', to: 'CN', value: 1000000 }, // RCEP適用
  { hs: '8703232900', from: 'JP', to: 'AU', value: 5000000 }, // 日豪EPA適用
  { hs: '8471300000', from: 'JP', to: 'US', value: 2000000 }  // 日米貿易協定
];
```

---

このAPIドキュメントは随時更新されます。最新の情報は [GitHub Repository](../../) をご確認ください。
