-- HS Tariff Navigator Extended Agreements
-- 譛譁ｰ縺ｮFTA/EPA蜊泌ｮ壹ョ繝ｼ繧ｿ

INSERT INTO agreements (id, name_ja, name_en, countries, effective_date, document_url, priority, is_active) VALUES

-- 譌･闍ｱEPA・・021蟷ｴ逋ｺ蜉ｹ・・('juk-epa', '譌･闍ｱEPA・域律闍ｱ蛹・峡逧・ｵ梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-UK Comprehensive Economic Partnership Agreement',
 ARRAY['JP','GB'], 
 '2021-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-uk/', 6, true),

-- 譌･ASEAN EPA・・008蟷ｴ逋ｺ蜉ｹ・・('jasean-epa', '譌･ASEAN EPA・域律ASEAN蛹・峡逧・ｵ梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-ASEAN Comprehensive Economic Partnership',
 ARRAY['JP','TH','VN','MY','SG','ID','PH','BN','KH','LA','MM'],
 '2008-12-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-asean/', 7, true),

-- 譌･繧ｹ繧､繧ｹEPA・・009蟷ｴ逋ｺ蜉ｹ・・('jch-epa', '譌･繧ｹ繧､繧ｹEPA・域律繧ｹ繧､繧ｹ邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Switzerland Economic Partnership Agreement',
 ARRAY['JP','CH'], 
 '2009-09-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-swiss/', 8, true),

-- 譌･繝√ΜEPA・・007蟷ｴ逋ｺ蜉ｹ・・('jcl-epa', '譌･繝√ΜEPA・域律繝√Μ謌ｦ逡･逧・ｵ梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Chile Strategic Economic Partnership Agreement',
 ARRAY['JP','CL'], 
 '2007-09-03', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-chile/', 9, true),

-- 譌･繧ｿ繧､EPA・・007蟷ｴ逋ｺ蜉ｹ・・('jth-epa', '譌･繧ｿ繧､EPA・域律繧ｿ繧､邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Thailand Economic Partnership Agreement',
 ARRAY['JP','TH'], 
 '2007-11-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-thai/', 10, true),

-- 譌･繧､繝ｳ繝峨ロ繧ｷ繧｢EPA・・008蟷ｴ逋ｺ蜉ｹ・・('jid-epa', '譌･繧､繝ｳ繝峨ロ繧ｷ繧｢EPA・域律繧､繝ｳ繝峨ロ繧ｷ繧｢邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Indonesia Economic Partnership Agreement',
 ARRAY['JP','ID'], 
 '2008-07-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-indonesia/', 11, true),

-- 譌･繝輔ぅ繝ｪ繝斐ΦEPA・・008蟷ｴ逋ｺ蜉ｹ・・('jph-epa', '譌･繝輔ぅ繝ｪ繝斐ΦEPA・域律繝輔ぅ繝ｪ繝斐Φ邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Philippines Economic Partnership Agreement',
 ARRAY['JP','PH'], 
 '2008-12-11', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-philippines/', 12, true),

-- 譌･繧ｷ繝ｳ繧ｬ繝昴・繝ｫEPA・・002蟷ｴ逋ｺ蜉ｹ縲∵隼豁｣2007蟷ｴ・・('jsg-epa', '譌･繧ｷ繝ｳ繧ｬ繝昴・繝ｫEPA・域律繧ｷ繝ｳ繧ｬ繝昴・繝ｫ邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Singapore Economic Partnership Agreement',
 ARRAY['JP','SG'], 
 '2002-11-30', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-singapore/', 13, true),

-- 譌･繝槭Ξ繝ｼ繧ｷ繧｢EPA・・006蟷ｴ逋ｺ蜉ｹ・・('jmy-epa', '譌･繝槭Ξ繝ｼ繧ｷ繧｢EPA・域律繝槭Ξ繝ｼ繧ｷ繧｢邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Malaysia Economic Partnership Agreement',
 ARRAY['JP','MY'], 
 '2006-07-13', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-malaysia/', 14, true),

-- 譌･繝吶ヨ繝翫ΒEPA・・009蟷ｴ逋ｺ蜉ｹ・・('jvn-epa', '譌･繝吶ヨ繝翫ΒEPA・域律繝吶ヨ繝翫Β邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Viet Nam Economic Partnership Agreement',
 ARRAY['JP','VN'], 
 '2009-10-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-vietnam/', 15, true),

-- 譌･繝｢繝ｳ繧ｴ繝ｫEPA・・016蟷ｴ逋ｺ蜉ｹ・・('jmn-epa', '譌･繝｢繝ｳ繧ｴ繝ｫEPA・域律繝｢繝ｳ繧ｴ繝ｫ邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Mongolia Economic Partnership Agreement',
 ARRAY['JP','MN'], 
 '2016-06-07', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-mongolia/', 16, true),

-- 譌･繝医Ν繧ｳEPA・井ｺ､貂我ｸｭ・・('jtr-epa', '譌･繝医Ν繧ｳEPA・域律繝医Ν繧ｳ邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Turkey Economic Partnership Agreement',
 ARRAY['JP','TR'], 
 '2025-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-turkey/', 17, false),

-- 譌･繧ｳ繝ｭ繝ｳ繝薙いEPA・井ｺ､貂我ｸｭ・・('jco-epa', '譌･繧ｳ繝ｭ繝ｳ繝薙いEPA・域律繧ｳ繝ｭ繝ｳ繝薙い邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Colombia Economic Partnership Agreement',
 ARRAY['JP','CO'], 
 '2025-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-colombia/', 18, false),

-- 譌･髻摘PA・井ｸｭ譁ｭ荳ｭ・・('jkr-epa', '譌･髻摘PA・域律髻鍋ｵ梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Korea Economic Partnership Agreement',
 ARRAY['JP','KR'], 
 '2025-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-korea/', 19, false),

-- 譌･荳ｭ髻擢TA・井ｺ､貂我ｸｭ・・('jck-fta', '譌･荳ｭ髻擢TA・域律荳ｭ髻楢・逕ｱ雋ｿ譏灘鵠螳夲ｼ・, 'Japan-China-Korea Free Trade Agreement',
 ARRAY['JP','CN','KR'], 
 '2025-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/jck/', 20, false);
