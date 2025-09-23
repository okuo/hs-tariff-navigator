-- Trade Lens Database Data Update
-- データ拡充用統合SQLファイル
-- 以下の順序で実行してください

-- 1. 拡張HSコードデータの追加
-- hs_codes_extended.sql の内容をここに統合済み

-- 2. 拡張協定データの追加
-- agreements_extended.sql の内容をここに統合済み

-- 3. 拡張関税率データの追加
-- tariff_rates_extended.sql の内容をここに統合済み

-- 実行前の確認クエリ
SELECT 'Before update - HS Codes count:' as info, COUNT(*) as count FROM hs_codes
UNION ALL
SELECT 'Before update - Agreements count:', COUNT(*) FROM agreements
UNION ALL
SELECT 'Before update - Tariff rates count:', COUNT(*) FROM tariff_rates;

-- ここから実際のデータ追加を開始
-- （個別SQLファイルの内容を順次実行）