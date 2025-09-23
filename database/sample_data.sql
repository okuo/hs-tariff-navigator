-- Trade Lens Database Sample Data
-- テスト用サンプルデータ

-- HSコードサンプルデータ
INSERT INTO hs_codes (code, description_ja, description_en, unit, category, subcategory) VALUES
('8507100000', '鉛蓄電池（始動用）', 'Lead-acid accumulators for starting piston engines', 'NO', '機械類', '電池'),
('8507200000', '鉛蓄電池（その他）', 'Other lead-acid accumulators', 'NO', '機械類', '電池'),
('8471300000', '携帯用自動データ処理機械', 'Portable automatic data processing machines', 'NO', '機械類', 'コンピュータ'),
('6203423000', '男子用ズボン（綿製）', 'Men''s trousers of cotton', 'NO', '繊維製品', '衣類'),
('8703232900', '乗用自動車（ガソリン車、1500cc以下）', 'Passenger motor cars with gasoline engines (≤1500cc)', 'NO', '輸送機器', '自動車'),
('8703332900', '乗用自動車（ガソリン車、1500cc超3000cc以下）', 'Passenger motor cars with gasoline engines (1500-3000cc)', 'NO', '輸送機器', '自動車'),
('0901119000', 'コーヒー（焙煎していないもの、その他）', 'Coffee, not roasted, other', 'KG', '農産物', '飲料原料'),
('1701110000', '粗糖（甜菜糖）', 'Raw beet sugar', 'KG', '農産物', '砂糖類'),
('2208202000', 'ウイスキー', 'Whisky', 'LT', '飲料', 'アルコール'),
('8471494000', '自動データ処理機械（その他）', 'Other automatic data processing machines', 'NO', '機械類', 'コンピュータ'),
('8517120000', '携帯電話', 'Cellular phones', 'NO', '機械類', '通信機器'),
('8528723000', 'カラー受像機（液晶ディスプレイ）', 'Color LCD television receivers', 'NO', '機械類', '電子機器'),
('6204620000', '婦人用ズボン（綿製）', 'Women''s trousers of cotton', 'NO', '繊維製品', '衣類'),
('8544421900', '電気絶縁電線（その他）', 'Other insulated electric conductors', 'KG', '機械類', '電線'),
('3004909000', '医薬品（その他）', 'Other medicaments', 'KG', '化学製品', '医薬品');

-- FTA/EPA協定サンプルデータ
INSERT INTO agreements (id, name_ja, name_en, countries, effective_date, document_url, priority, is_active) VALUES
('rcep', 'RCEP（地域的な包括的経済連携）', 'Regional Comprehensive Economic Partnership', 
 ARRAY['JP','CN','KR','TH','VN','MY','SG','ID','PH','AU','NZ','BN','KH','LA','MM'], 
 '2022-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-eacepa/', 1, true),

('cptpp', 'CPTPP（環太平洋パートナーシップ協定）', 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
 ARRAY['JP','AU','CA','CL','MX','NZ','PE','SG','VN','MY','BN'],
 '2018-12-30', 'https://www.mofa.go.jp/mofaj/gaiko/fta/tpp/', 2, true),

('jaepa', '日豪EPA（日豪経済連携協定）', 'Japan-Australia Economic Partnership Agreement',
 ARRAY['JP','AU'], 
 '2015-01-15', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-a/', 3, true),

('jepa', '日EU・EPA（日欧経済連携協定）', 'Japan-EU Economic Partnership Agreement',
 ARRAY['JP','DE','FR','IT','ES','NL','BE','AT','PL','RO','GR','PT','CZ','HU','SE','BG','DK','FI','SK','HR','IE','LT','SI','LV','EE','CY','LU','MT'],
 '2019-02-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-eu/', 4, true),

('jusmca', '日米貿易協定', 'Japan-United States Trade Agreement', 
 ARRAY['JP','US'],
 '2020-01-01', 'https://www.mofa.go.jp/mofaj/na/na1/us/page25_001767.html', 5, true);

-- 関税率サンプルデータ
INSERT INTO tariff_rates (hs_code, country_from, country_to, agreement_id, base_rate, preferential_rate, conditions, effective_date) VALUES
-- 日本から中国（RCEP）
('8507100000', 'JP', 'CN', 'rcep', 10.0, 0.0, '{"origin_requirement": "原産地証明書が必要"}', '2022-01-01'),
('8471300000', 'JP', 'CN', 'rcep', 15.0, 5.0, '{"origin_requirement": "原産地証明書が必要"}', '2022-01-01'),
('6203423000', 'JP', 'CN', 'rcep', 20.0, 8.0, '{"origin_requirement": "原産地証明書が必要"}', '2022-01-01'),

-- 日本からオーストラリア（JAEPA）
('8703232900', 'JP', 'AU', 'jaepa', 5.0, 0.0, '{"origin_requirement": "原産地証明書が必要"}', '2015-01-15'),
('8507100000', 'JP', 'AU', 'jaepa', 8.0, 0.0, '{"origin_requirement": "原産地証明書が必要"}', '2015-01-15'),

-- 日本からアメリカ（日米貿易協定）
('8703332900', 'JP', 'US', 'jusmca', 2.5, 0.0, '{"origin_requirement": "自己申告制度"}', '2020-01-01'),
('8471494000', 'JP', 'US', 'jusmca', 0.0, 0.0, '{"duty_free": true}', '2020-01-01'),

-- 中国から日本（RCEP）
('8517120000', 'CN', 'JP', 'rcep', 0.0, 0.0, '{"duty_free": true}', '2022-01-01'),
('8528723000', 'CN', 'JP', 'rcep', 8.0, 4.0, '{"origin_requirement": "原産地証明書が必要"}', '2022-01-01'),

-- オーストラリアから日本（JAEPA/CPTPP）
('0901119000', 'AU', 'JP', 'jaepa', 6.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2015-01-15'),
('1701110000', 'AU', 'JP', 'cptpp', 71.8, 35.9, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2018-12-30'),

-- EU から日本（日EU EPA）
('2208202000', 'DE', 'JP', 'jepa', 15.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "7年"}', '2019-02-01'),
('6204620000', 'IT', 'JP', 'jepa', 10.9, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2019-02-01');

-- MFN（最恵国）基本税率（協定なし）
INSERT INTO tariff_rates (hs_code, country_from, country_to, agreement_id, base_rate, preferential_rate, effective_date) VALUES
('8507100000', 'JP', 'KR', NULL, 10.0, 10.0, '2024-01-01'),
('8471300000', 'JP', 'TW', NULL, 15.0, 15.0, '2024-01-01'),
('6203423000', 'JP', 'TH', NULL, 20.0, 20.0, '2024-01-01'),
('8703232900', 'JP', 'IN', NULL, 10.0, 10.0, '2024-01-01');