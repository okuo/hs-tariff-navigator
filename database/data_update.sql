-- HS Tariff Navigator Database Data Update
-- 繝・・繧ｿ諡｡蜈・畑邨ｱ蜷・QL繝輔ぃ繧､繝ｫ
-- 莉･荳九・鬆・ｺ上〒螳溯｡後＠縺ｦ縺上□縺輔＞

-- 1. 諡｡蠑ｵHS繧ｳ繝ｼ繝峨ョ繝ｼ繧ｿ縺ｮ霑ｽ蜉
-- hs_codes_extended.sql 縺ｮ蜀・ｮｹ繧偵％縺薙↓邨ｱ蜷域ｸ医∩

-- 2. 諡｡蠑ｵ蜊泌ｮ壹ョ繝ｼ繧ｿ縺ｮ霑ｽ蜉
-- agreements_extended.sql 縺ｮ蜀・ｮｹ繧偵％縺薙↓邨ｱ蜷域ｸ医∩

-- 3. 諡｡蠑ｵ髢｢遞守紫繝・・繧ｿ縺ｮ霑ｽ蜉
-- tariff_rates_extended.sql 縺ｮ蜀・ｮｹ繧偵％縺薙↓邨ｱ蜷域ｸ医∩

-- 螳溯｡悟燕縺ｮ遒ｺ隱阪け繧ｨ繝ｪ
SELECT 'Before update - HS Codes count:' as info, COUNT(*) as count FROM hs_codes
UNION ALL
SELECT 'Before update - Agreements count:', COUNT(*) FROM agreements
UNION ALL
SELECT 'Before update - Tariff rates count:', COUNT(*) FROM tariff_rates;

-- 縺薙％縺九ｉ螳滄圀縺ｮ繝・・繧ｿ霑ｽ蜉繧帝幕蟋・-- ・亥句挨SQL繝輔ぃ繧､繝ｫ縺ｮ蜀・ｮｹ繧帝・ｬ｡螳溯｡鯉ｼ
