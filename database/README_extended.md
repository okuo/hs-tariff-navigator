# HS Tariff Navigator Database Data Update

## 諡｡蜈・ョ繝ｼ繧ｿ繝輔ぃ繧､繝ｫ

譁ｰ縺励￥菴懈・縺励◆繝・・繧ｿ繝輔ぃ繧､繝ｫ・・
### 1. HS繧ｳ繝ｼ繝峨ョ繝ｼ繧ｿ諡｡蜈・**繝輔ぃ繧､繝ｫ**: `hs_codes_extended.sql`
- 霑ｽ蜉蜩∫岼謨ｰ: 邏・5蜩∫岼
- 繧ｫ繝・ざ繝ｪ: 蜊雁ｰ惹ｽ薙∬・蜍戊ｻ翫∵ｩ滓｢ｰ縲∝喧蟄ｦ縲・｣溷刀縲∫ｹ顔ｶｭ縲・≡螻槭∝・蟄ｦ讖溷勣
- 譌･譛ｬ縺ｮ荳ｻ隕∬ｼｸ蜃ｺ蜈･蜩∫岼繧堤ｶｲ鄒・
### 2. FTA/EPA蜊泌ｮ壹ョ繝ｼ繧ｿ諡｡蜈・**繝輔ぃ繧､繝ｫ**: `agreements_extended.sql`
- 霑ｽ蜉蜊泌ｮ壽焚: 15蜊泌ｮ・- 蜷ｫ縺ｾ繧後ｋ蜊泌ｮ・
  - 譌･闍ｱEPA (2021蟷ｴ逋ｺ蜉ｹ)
  - 譌･ASEAN EPA (2008蟷ｴ逋ｺ蜉ｹ)
  - 譌･繧ｹ繧､繧ｹEPA (2009蟷ｴ逋ｺ蜉ｹ)
  - 譌･繝√ΜEPA (2007蟷ｴ逋ｺ蜉ｹ)
  - 蜷・ｺ悟嵜髢摘PA・医ち繧､縲√う繝ｳ繝峨ロ繧ｷ繧｢縲√ヵ繧｣繝ｪ繝斐Φ遲会ｼ・  - 莠､貂我ｸｭ繝ｻ荳ｭ譁ｭ荳ｭ縺ｮ蜊泌ｮ壹ｂ蜷ｫ繧

### 3. 髢｢遞守紫繝・・繧ｿ諡｡蜈・**繝輔ぃ繧､繝ｫ**: `tariff_rates_extended.sql`
- 霑ｽ蜉繝・・繧ｿ謨ｰ: 邏・0莉ｶ
- 荳ｻ隕∝刀逶ｮ縺ｮ蜊泌ｮ壼挨髢｢遞守紫
- 谿ｵ髫守噪蜑頑ｸ帙せ繧ｱ繧ｸ繝･繝ｼ繝ｫ諠・ｱ
- 蜴溽肇蝨ｰ險ｼ譏手ｦ∽ｻｶ

## 螳溯｡梧焔鬆・
### 譁ｹ豕・: 蛟句挨繝輔ぃ繧､繝ｫ螳溯｡鯉ｼ域耳螂ｨ・・Supabase SQL Editor縺ｧ莉･荳九・鬆・ｺ上〒螳溯｡鯉ｼ・
1. `hs_codes_extended.sql`
2. `agreements_extended.sql`  
3. `tariff_rates_extended.sql`

### 譁ｹ豕・: 荳諡ｬ螳溯｡・蜷・ヵ繧｡繧､繝ｫ縺ｮ蜀・ｮｹ繧蛋data_update.sql`縺ｫ縺ｾ縺ｨ繧√※螳溯｡・
## 螳溯｡悟ｾ後・遒ｺ隱・
莉･荳九・繧ｯ繧ｨ繝ｪ縺ｧ霑ｽ蜉縺輔ｌ縺溘ョ繝ｼ繧ｿ繧堤｢ｺ隱搾ｼ・
```sql
-- 繝・・繧ｿ莉ｶ謨ｰ遒ｺ隱・SELECT 'HS Codes' as table_name, COUNT(*) as count FROM hs_codes
UNION ALL
SELECT 'Agreements', COUNT(*) FROM agreements
UNION ALL
SELECT 'Tariff Rates', COUNT(*) FROM tariff_rates;

-- 譁ｰ縺励＞HS繧ｳ繝ｼ繝峨・讀懃ｴ｢繝・せ繝・SELECT * FROM search_hs_codes('蜊雁ｰ惹ｽ・, 5);
SELECT * FROM search_hs_codes('閾ｪ蜍戊ｻ・, 5);

-- 譁ｰ縺励＞蜊泌ｮ壹・遒ｺ隱・SELECT id, name_ja, array_length(countries, 1) as country_count 
FROM agreements 
WHERE effective_date >= '2020-01-01'
ORDER BY effective_date DESC;
```

## 譛溷ｾ・＆繧後ｋ邨先棡

諡｡蜈・ｾ後・繝・・繧ｿ莉ｶ謨ｰ逶ｮ螳会ｼ・- HS繧ｳ繝ｼ繝・ 邏・0莉ｶ (蝓ｺ譛ｬ15莉ｶ + 諡｡蠑ｵ75莉ｶ)
- 蜊泌ｮ・ 邏・0莉ｶ (蝓ｺ譛ｬ5莉ｶ + 諡｡蠑ｵ15莉ｶ)
- 髢｢遞守紫: 邏・30莉ｶ (蝓ｺ譛ｬ40莉ｶ + 諡｡蠑ｵ90莉ｶ)

縺薙ｌ縺ｫ繧医ｊ讀懃ｴ｢邊ｾ蠎ｦ縺ｨ髢｢遞取怙驕ｩ蛹悶・邊ｾ蠎ｦ縺悟､ｧ蟷・↓蜷台ｸ翫＠縺ｾ縺吶
