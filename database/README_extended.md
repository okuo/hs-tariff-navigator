# Trade Lens Database Data Update

## 拡充データファイル

新しく作成したデータファイル：

### 1. HSコードデータ拡充
**ファイル**: `hs_codes_extended.sql`
- 追加品目数: 約75品目
- カテゴリ: 半導体、自動車、機械、化学、食品、繊維、金属、光学機器
- 日本の主要輸出入品目を網羅

### 2. FTA/EPA協定データ拡充
**ファイル**: `agreements_extended.sql`
- 追加協定数: 15協定
- 含まれる協定:
  - 日英EPA (2021年発効)
  - 日ASEAN EPA (2008年発効)
  - 日スイスEPA (2009年発効)
  - 日チリEPA (2007年発効)
  - 各二国間EPA（タイ、インドネシア、フィリピン等）
  - 交渉中・中断中の協定も含む

### 3. 関税率データ拡充
**ファイル**: `tariff_rates_extended.sql`
- 追加データ数: 約90件
- 主要品目の協定別関税率
- 段階的削減スケジュール情報
- 原産地証明要件

## 実行手順

### 方法1: 個別ファイル実行（推奨）
Supabase SQL Editorで以下の順序で実行：

1. `hs_codes_extended.sql`
2. `agreements_extended.sql`  
3. `tariff_rates_extended.sql`

### 方法2: 一括実行
各ファイルの内容を`data_update.sql`にまとめて実行

## 実行後の確認

以下のクエリで追加されたデータを確認：

```sql
-- データ件数確認
SELECT 'HS Codes' as table_name, COUNT(*) as count FROM hs_codes
UNION ALL
SELECT 'Agreements', COUNT(*) FROM agreements
UNION ALL
SELECT 'Tariff Rates', COUNT(*) FROM tariff_rates;

-- 新しいHSコードの検索テスト
SELECT * FROM search_hs_codes('半導体', 5);
SELECT * FROM search_hs_codes('自動車', 5);

-- 新しい協定の確認
SELECT id, name_ja, array_length(countries, 1) as country_count 
FROM agreements 
WHERE effective_date >= '2020-01-01'
ORDER BY effective_date DESC;
```

## 期待される結果

拡充後のデータ件数目安：
- HSコード: 約90件 (基本15件 + 拡張75件)
- 協定: 約20件 (基本5件 + 拡張15件)
- 関税率: 約130件 (基本40件 + 拡張90件)

これにより検索精度と関税最適化の精度が大幅に向上します。