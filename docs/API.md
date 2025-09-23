# Trade Lens API ドキュメント

Trade Lens で使用されるSupabase API関数とデータベーススキーマの詳細ドキュメントです。

## 📊 データベーススキーマ

### テーブル構造

#### `hs_codes` - HSコードマスター
```sql
CREATE TABLE hs_codes (
  code VARCHAR(10) PRIMARY KEY,        -- HSコード (10桁)
  description_ja TEXT NOT NULL,        -- 日本語品目名
  description_en TEXT NOT NULL,        -- 英語品目名  
  unit VARCHAR(10) NOT NULL,           -- 単位 (NO, KG, LT等)
  category VARCHAR(100),               -- 大分類
  subcategory VARCHAR(100),            -- 小分類
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `agreements` - FTA/EPA協定マスター
```sql
CREATE TABLE agreements (
  id VARCHAR(20) PRIMARY KEY,          -- 協定ID (例: rcep, cptpp)
  name_ja VARCHAR(200) NOT NULL,       -- 日本語協定名
  name_en VARCHAR(200) NOT NULL,       -- 英語協定名
  countries TEXT[] NOT NULL,           -- 対象国配列
  effective_date DATE NOT NULL,        -- 発効日
  document_url TEXT,                   -- 協定文書URL
  priority INTEGER DEFAULT 1,         -- 優先度 (数字が小さいほど高優先)
  is_active BOOLEAN DEFAULT TRUE,     -- 有効フラグ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `tariff_rates` - 関税率テーブル
```sql
CREATE TABLE tariff_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hs_code VARCHAR(10) REFERENCES hs_codes(code),    -- HSコード
  country_from VARCHAR(2) NOT NULL,                  -- 輸出国コード
  country_to VARCHAR(2) NOT NULL,                    -- 輸入国コード
  agreement_id VARCHAR(20) REFERENCES agreements(id), -- 協定ID (NULLはMFN税率)
  base_rate DECIMAL(5,2) NOT NULL,                   -- 基本税率 (%)
  preferential_rate DECIMAL(5,2),                    -- 協定税率 (%)
  conditions JSONB,                                  -- 適用条件
  effective_date DATE NOT NULL,                      -- 発効日
  expires_date DATE,                                 -- 失効日
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `search_history` - 検索履歴
```sql
CREATE TABLE search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,                        -- ユーザーID (将来の認証用)
  hs_code VARCHAR(10) NOT NULL,        -- 検索したHSコード
  country_from VARCHAR(2) NOT NULL,    -- 輸出国
  country_to VARCHAR(2) NOT NULL,      -- 輸入国
  trade_value BIGINT,                  -- 貿易金額
  search_results JSONB NOT NULL,       -- 検索結果JSON
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔧 RPC関数 (API エンドポイント)

### `search_hs_codes` - HSコード検索

日本語・英語の品目名やHSコード番号からHSコードを検索します。

#### 関数定義
```sql
search_hs_codes(
  search_term TEXT,           -- 検索キーワード
  limit_count INTEGER = 10    -- 取得件数上限
)
```

#### パラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| `search_term` | TEXT | ✅ | 検索キーワード (HSコード、日本語、英語) |
| `limit_count` | INTEGER | ❌ | 取得件数 (デフォルト: 10, 最大: 50) |

#### 戻り値
```typescript
type HSCodeSearchResult = {
  code: string;           // HSコード
  description_ja: string; // 日本語品目名
  description_en: string; // 英語品目名
  unit: string;          // 単位
  rank: number;          // 関連度スコア (0-3, 高いほど関連度高)
}[]
```

#### 使用例

**JavaScript/TypeScript**
```typescript
const { data, error } = await supabase.rpc('search_hs_codes', {
  search_term: '電池',
  limit_count: 5
});

console.log(data);
// [
//   {
//     code: '8507100000',
//     description_ja: '鉛蓄電池（始動用）',
//     description_en: 'Lead-acid accumulators for starting piston engines',
//     unit: 'NO',
//     rank: 2.5
//   },
//   ...
// ]
```

**SQL直接実行**
```sql
SELECT * FROM search_hs_codes('半導体', 10);
```

### `optimize_tariff` - 関税最適化

指定されたHSコードと貿易ルートに対して最適なFTA/EPA協定を提案します。

#### 関数定義
```sql
optimize_tariff(
  p_hs_code VARCHAR(10),      -- HSコード
  p_from_country VARCHAR(2),  -- 輸出国コード
  p_to_country VARCHAR(2),    -- 輸入国コード
  p_trade_value BIGINT = NULL -- 貿易金額(円)
)
```

#### パラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| `p_hs_code` | VARCHAR(10) | ✅ | HSコード |
| `p_from_country` | VARCHAR(2) | ✅ | 輸出国コード (ISO 3166-1 alpha-2) |
| `p_to_country` | VARCHAR(2) | ✅ | 輸入国コード (ISO 3166-1 alpha-2) |
| `p_trade_value` | BIGINT | ❌ | 貿易金額 (円) |

#### 戻り値
```typescript
type TariffOptimizationResult = {
  hs_code: string;              // HSコード
  from_country: string;         // 輸出国コード
  to_country: string;           // 輸入国コード
  base_rate: number;            // MFN基本税率 (%)
  trade_value: number | null;   // 貿易金額
  agreements: Agreement[];      // 利用可能協定一覧
  best_agreement: Agreement | null; // 最適協定
}

type Agreement = {
  agreement: {
    id: string;            // 協定ID
    name_ja: string;       // 日本語協定名
    name_en: string;       // 英語協定名
    countries: string[];   // 対象国リスト
    effective_date: string; // 発効日
    priority: number;      // 優先度
  };
  rate: number;            // 協定税率 (%)
  savings_amount: number;  // 削減金額 (円)
  savings_percentage: number; // 削減率 (%)
  conditions: Record<string, any> | null; // 適用条件
}
```

#### 使用例

**JavaScript/TypeScript**
```typescript
const { data, error } = await supabase.rpc('optimize_tariff', {
  p_hs_code: '8507100000',
  p_from_country: 'JP',
  p_to_country: 'CN',
  p_trade_value: 1000000
});

console.log(data);
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

### `get_agreements_by_countries` - 国別協定検索

指定された国間で有効なFTA/EPA協定を取得します。

#### 関数定義
```sql
get_agreements_by_countries(
  p_from_country VARCHAR(2),  -- 輸出国コード
  p_to_country VARCHAR(2)     -- 輸入国コード
)
```

#### 戻り値
```typescript
type AgreementInfo = {
  id: string;            // 協定ID
  name_ja: string;       // 日本語協定名
  name_en: string;       // 英語協定名
  priority: number;      // 優先度
  effective_date: string; // 発効日
}[]
```

## 🌐 Frontend API クライアント

### Supabaseクライアント設定

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
```

### APIラッパー関数

#### HSコード検索API
```typescript
// src/lib/api.ts
export async function searchHSCodes(
  searchTerm: string, 
  limit: number = 10
) {
  const { data, error } = await supabase.rpc('search_hs_codes', {
    search_term: searchTerm,
    limit_count: limit
  });
  
  if (error) throw error;
  return data;
}
```

#### 関税最適化API
```typescript
export async function optimizeTariff(
  hsCode: string,
  fromCountry: string,
  toCountry: string,
  tradeValue?: number
) {
  const { data, error } = await supabase.rpc('optimize_tariff', {
    p_hs_code: hsCode,
    p_from_country: fromCountry,  
    p_to_country: toCountry,
    p_trade_value: tradeValue || null
  });
  
  if (error) throw error;
  return data;
}
```

#### 検索履歴保存API
```typescript
export async function saveSearchHistory(
  hsCode: string,
  fromCountry: string,
  toCountry: string,
  tradeValue: number | null,
  searchResults: any
) {
  const { error } = await supabase
    .from('search_history')
    .insert({
      hs_code: hsCode,
      country_from: fromCountry,
      country_to: toCountry,
      trade_value: tradeValue,
      search_results: searchResults
    });
    
  if (error) throw error;
}
```

## 🔐 セキュリティ・権限

### Row Level Security (RLS)

すべてのテーブルでRLSが有効化されています：

#### 読み取り権限
```sql
-- 全ユーザーに読み取り許可
CREATE POLICY "Allow public read access" ON [table_name]
  FOR SELECT USING (true);
```

#### 書き込み権限
```sql
-- 検索履歴のみ一般ユーザーも書き込み可能
CREATE POLICY "Allow public insert" ON search_history
  FOR INSERT WITH CHECK (true);

-- その他のテーブルは管理者のみ
CREATE POLICY "Allow admin write access" ON [table_name]
  FOR ALL USING (auth.role() = 'admin');
```

## 📝 エラーハンドリング

### 一般的なエラーと対処法

#### データベース接続エラー
```typescript
try {
  const result = await searchHSCodes('電池');
} catch (error) {
  if (error.message.includes('network')) {
    // ネットワークエラー - デモモードに切り替え
    return getDemoData();
  }
  console.error('API Error:', error);
}
```

#### レート制限エラー
```typescript
// Supabaseの無料プランでは1時間あたりの制限あり
if (error.message.includes('rate limit')) {
  // 少し待ってからリトライ
  await new Promise(resolve => setTimeout(resolve, 1000));
  return searchHSCodes(searchTerm, limit);
}
```

## 🧪 テスト用データ

### サンプルAPIコール

以下はテスト用のサンプルデータです：

```typescript
// HSコード検索テスト
const testSearches = [
  '電池',      // 複数結果
  '8507100000', // 完全一致
  'battery',    // 英語検索
  'smartphone'  // 部分一致
];

// 関税最適化テスト
const testOptimizations = [
  { hs: '8507100000', from: 'JP', to: 'CN', value: 1000000 }, // RCEP適用
  { hs: '8703232900', from: 'JP', to: 'AU', value: 5000000 }, // 日豪EPA適用
  { hs: '8471300000', from: 'JP', to: 'US', value: 2000000 }  // 日米貿易協定
];
```

## 📊 パフォーマンス考慮事項

### インデックス最適化

効率的な検索のために以下のインデックスが設定されています：

```sql
-- 全文検索用
CREATE INDEX idx_hs_codes_description_ja ON hs_codes 
  USING gin(description_ja gin_trgm_ops);
CREATE INDEX idx_hs_codes_description_en ON hs_codes 
  USING gin(description_en gin_trgm_ops);

-- 関税率検索用  
CREATE INDEX idx_tariff_rates_hs_code ON tariff_rates(hs_code);
CREATE INDEX idx_tariff_rates_countries ON tariff_rates(country_from, country_to);
```

### キャッシュ戦略

- 検索結果は chrome.storage にキャッシュ
- 静的データ（協定情報等）は定期的にキャッシュ更新
- ネットワークエラー時はキャッシュデータを返却

---

このAPIドキュメントは随時更新されます。最新の情報は [GitHub Repository](../../) をご確認ください。