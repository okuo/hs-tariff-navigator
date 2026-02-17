-- HS Tariff Navigator Database Sample Data
-- 繝・せ繝育畑繧ｵ繝ｳ繝励Ν繝・・繧ｿ

-- HS繧ｳ繝ｼ繝峨し繝ｳ繝励Ν繝・・繧ｿ
INSERT INTO hs_codes (code, description_ja, description_en, unit, category, subcategory) VALUES
('8507100000', '驩幄塘髮ｻ豎・亥ｧ句虚逕ｨ・・, 'Lead-acid accumulators for starting piston engines', 'NO', '讖滓｢ｰ鬘・, '髮ｻ豎'),
('8507200000', '驩幄塘髮ｻ豎・医◎縺ｮ莉厄ｼ・, 'Other lead-acid accumulators', 'NO', '讖滓｢ｰ鬘・, '髮ｻ豎'),
('8471300000', '謳ｺ蟶ｯ逕ｨ閾ｪ蜍輔ョ繝ｼ繧ｿ蜃ｦ逅・ｩ滓｢ｰ', 'Portable automatic data processing machines', 'NO', '讖滓｢ｰ鬘・, '繧ｳ繝ｳ繝斐Η繝ｼ繧ｿ'),
('6203423000', '逕ｷ蟄千畑繧ｺ繝懊Φ・育ｶｿ陬ｽ・・, 'Men''s trousers of cotton', 'NO', '郢顔ｶｭ陬ｽ蜩・, '陦｣鬘・),
('8703232900', '荵礼畑閾ｪ蜍戊ｻ奇ｼ医ぎ繧ｽ繝ｪ繝ｳ霆翫・500cc莉･荳具ｼ・, 'Passenger motor cars with gasoline engines (竕､1500cc)', 'NO', '霈ｸ騾∵ｩ溷勣', '閾ｪ蜍戊ｻ・),
('8703332900', '荵礼畑閾ｪ蜍戊ｻ奇ｼ医ぎ繧ｽ繝ｪ繝ｳ霆翫・500cc雜・000cc莉･荳具ｼ・, 'Passenger motor cars with gasoline engines (1500-3000cc)', 'NO', '霈ｸ騾∵ｩ溷勣', '閾ｪ蜍戊ｻ・),
('0901119000', '繧ｳ繝ｼ繝偵・・育・辣弱＠縺ｦ縺・↑縺・ｂ縺ｮ縲√◎縺ｮ莉厄ｼ・, 'Coffee, not roasted, other', 'KG', '霎ｲ逕｣迚ｩ', '鬟ｲ譁吝次譁・),
('1701110000', '邊礼ｳ厄ｼ育莫闖懃ｳ厄ｼ・, 'Raw beet sugar', 'KG', '霎ｲ逕｣迚ｩ', '遐らｳ夜｡・),
('2208202000', '繧ｦ繧､繧ｹ繧ｭ繝ｼ', 'Whisky', 'LT', '鬟ｲ譁・, '繧｢繝ｫ繧ｳ繝ｼ繝ｫ'),
('8471494000', '閾ｪ蜍輔ョ繝ｼ繧ｿ蜃ｦ逅・ｩ滓｢ｰ・医◎縺ｮ莉厄ｼ・, 'Other automatic data processing machines', 'NO', '讖滓｢ｰ鬘・, '繧ｳ繝ｳ繝斐Η繝ｼ繧ｿ'),
('8517120000', '謳ｺ蟶ｯ髮ｻ隧ｱ', 'Cellular phones', 'NO', '讖滓｢ｰ鬘・, '騾壻ｿ｡讖溷勣'),
('8528723000', '繧ｫ繝ｩ繝ｼ蜿怜ワ讖滂ｼ域ｶｲ譎ｶ繝・ぅ繧ｹ繝励Ξ繧､・・, 'Color LCD television receivers', 'NO', '讖滓｢ｰ鬘・, '髮ｻ蟄先ｩ溷勣'),
('6204620000', '蟀ｦ莠ｺ逕ｨ繧ｺ繝懊Φ・育ｶｿ陬ｽ・・, 'Women''s trousers of cotton', 'NO', '郢顔ｶｭ陬ｽ蜩・, '陦｣鬘・),
('8544421900', '髮ｻ豌礼ｵｶ邵・崕邱夲ｼ医◎縺ｮ莉厄ｼ・, 'Other insulated electric conductors', 'KG', '讖滓｢ｰ鬘・, '髮ｻ邱・),
('3004909000', '蛹ｻ阮ｬ蜩・ｼ医◎縺ｮ莉厄ｼ・, 'Other medicaments', 'KG', '蛹門ｭｦ陬ｽ蜩・, '蛹ｻ阮ｬ蜩・);

-- FTA/EPA蜊泌ｮ壹し繝ｳ繝励Ν繝・・繧ｿ
INSERT INTO agreements (id, name_ja, name_en, countries, effective_date, document_url, priority, is_active) VALUES
('rcep', 'RCEP・亥慍蝓溽噪縺ｪ蛹・峡逧・ｵ梧ｸ磯｣謳ｺ・・, 'Regional Comprehensive Economic Partnership', 
 ARRAY['JP','CN','KR','TH','VN','MY','SG','ID','PH','AU','NZ','BN','KH','LA','MM'], 
 '2022-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-eacepa/', 1, true),

('cptpp', 'CPTPP・育腸螟ｪ蟷ｳ豢九ヱ繝ｼ繝医リ繝ｼ繧ｷ繝・・蜊泌ｮ夲ｼ・, 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
 ARRAY['JP','AU','CA','CL','MX','NZ','PE','SG','VN','MY','BN'],
 '2018-12-30', 'https://www.mofa.go.jp/mofaj/gaiko/fta/tpp/', 2, true),

('jaepa', '譌･雎ｪEPA・域律雎ｪ邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-Australia Economic Partnership Agreement',
 ARRAY['JP','AU'], 
 '2015-01-15', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-a/', 3, true),

('jepa', '譌･EU繝ｻEPA・域律谺ｧ邨梧ｸ磯｣謳ｺ蜊泌ｮ夲ｼ・, 'Japan-EU Economic Partnership Agreement',
 ARRAY['JP','DE','FR','IT','ES','NL','BE','AT','PL','RO','GR','PT','CZ','HU','SE','BG','DK','FI','SK','HR','IE','LT','SI','LV','EE','CY','LU','MT'],
 '2019-02-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-eu/', 4, true),

('jusmca', '譌･邀ｳ雋ｿ譏灘鵠螳・, 'Japan-United States Trade Agreement', 
 ARRAY['JP','US'],
 '2020-01-01', 'https://www.mofa.go.jp/mofaj/na/na1/us/page25_001767.html', 5, true);

-- 髢｢遞守紫繧ｵ繝ｳ繝励Ν繝・・繧ｿ
INSERT INTO tariff_rates (hs_code, country_from, country_to, agreement_id, base_rate, preferential_rate, conditions, effective_date) VALUES
-- 譌･譛ｬ縺九ｉ荳ｭ蝗ｽ・・CEP・・('8507100000', 'JP', 'CN', 'rcep', 10.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2022-01-01'),
('8471300000', 'JP', 'CN', 'rcep', 15.0, 5.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2022-01-01'),
('6203423000', 'JP', 'CN', 'rcep', 20.0, 8.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2022-01-01'),

-- 譌･譛ｬ縺九ｉ繧ｪ繝ｼ繧ｹ繝医Λ繝ｪ繧｢・・AEPA・・('8703232900', 'JP', 'AU', 'jaepa', 5.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2015-01-15'),
('8507100000', 'JP', 'AU', 'jaepa', 8.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2015-01-15'),

-- 譌･譛ｬ縺九ｉ繧｢繝｡繝ｪ繧ｫ・域律邀ｳ雋ｿ譏灘鵠螳夲ｼ・('8703332900', 'JP', 'US', 'jusmca', 2.5, 0.0, '{"origin_requirement": "閾ｪ蟾ｱ逕ｳ蜻雁宛蠎ｦ"}', '2020-01-01'),
('8471494000', 'JP', 'US', 'jusmca', 0.0, 0.0, '{"duty_free": true}', '2020-01-01'),

-- 荳ｭ蝗ｽ縺九ｉ譌･譛ｬ・・CEP・・('8517120000', 'CN', 'JP', 'rcep', 0.0, 0.0, '{"duty_free": true}', '2022-01-01'),
('8528723000', 'CN', 'JP', 'rcep', 8.0, 4.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2022-01-01'),

-- 繧ｪ繝ｼ繧ｹ繝医Λ繝ｪ繧｢縺九ｉ譌･譛ｬ・・AEPA/CPTPP・・('0901119000', 'AU', 'JP', 'jaepa', 6.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2015-01-15'),
('1701110000', 'AU', 'JP', 'cptpp', 71.8, 35.9, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2018-12-30'),

-- EU 縺九ｉ譌･譛ｬ・域律EU EPA・・('2208202000', 'DE', 'JP', 'jepa', 15.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "7蟷ｴ"}', '2019-02-01'),
('6204620000', 'IT', 'JP', 'jepa', 10.9, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2019-02-01');

-- MFN・域怙諱ｵ蝗ｽ・牙渕譛ｬ遞守紫・亥鵠螳壹↑縺暦ｼ・INSERT INTO tariff_rates (hs_code, country_from, country_to, agreement_id, base_rate, preferential_rate, effective_date) VALUES
('8507100000', 'JP', 'KR', NULL, 10.0, 10.0, '2024-01-01'),
('8471300000', 'JP', 'TW', NULL, 15.0, 15.0, '2024-01-01'),
('6203423000', 'JP', 'TH', NULL, 20.0, 20.0, '2024-01-01'),
('8703232900', 'JP', 'IN', NULL, 10.0, 10.0, '2024-01-01');
