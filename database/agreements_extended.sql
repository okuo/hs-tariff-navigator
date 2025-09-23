-- Trade Lens Extended Agreements
-- 最新のFTA/EPA協定データ

INSERT INTO agreements (id, name_ja, name_en, countries, effective_date, document_url, priority, is_active) VALUES

-- 日英EPA（2021年発効）
('juk-epa', '日英EPA（日英包括的経済連携協定）', 'Japan-UK Comprehensive Economic Partnership Agreement',
 ARRAY['JP','GB'], 
 '2021-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-uk/', 6, true),

-- 日ASEAN EPA（2008年発効）
('jasean-epa', '日ASEAN EPA（日ASEAN包括的経済連携協定）', 'Japan-ASEAN Comprehensive Economic Partnership',
 ARRAY['JP','TH','VN','MY','SG','ID','PH','BN','KH','LA','MM'],
 '2008-12-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-asean/', 7, true),

-- 日スイスEPA（2009年発効）
('jch-epa', '日スイスEPA（日スイス経済連携協定）', 'Japan-Switzerland Economic Partnership Agreement',
 ARRAY['JP','CH'], 
 '2009-09-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-swiss/', 8, true),

-- 日チリEPA（2007年発効）
('jcl-epa', '日チリEPA（日チリ戦略的経済連携協定）', 'Japan-Chile Strategic Economic Partnership Agreement',
 ARRAY['JP','CL'], 
 '2007-09-03', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-chile/', 9, true),

-- 日タイEPA（2007年発効）
('jth-epa', '日タイEPA（日タイ経済連携協定）', 'Japan-Thailand Economic Partnership Agreement',
 ARRAY['JP','TH'], 
 '2007-11-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-thai/', 10, true),

-- 日インドネシアEPA（2008年発効）
('jid-epa', '日インドネシアEPA（日インドネシア経済連携協定）', 'Japan-Indonesia Economic Partnership Agreement',
 ARRAY['JP','ID'], 
 '2008-07-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-indonesia/', 11, true),

-- 日フィリピンEPA（2008年発効）
('jph-epa', '日フィリピンEPA（日フィリピン経済連携協定）', 'Japan-Philippines Economic Partnership Agreement',
 ARRAY['JP','PH'], 
 '2008-12-11', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-philippines/', 12, true),

-- 日シンガポールEPA（2002年発効、改正2007年）
('jsg-epa', '日シンガポールEPA（日シンガポール経済連携協定）', 'Japan-Singapore Economic Partnership Agreement',
 ARRAY['JP','SG'], 
 '2002-11-30', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-singapore/', 13, true),

-- 日マレーシアEPA（2006年発効）
('jmy-epa', '日マレーシアEPA（日マレーシア経済連携協定）', 'Japan-Malaysia Economic Partnership Agreement',
 ARRAY['JP','MY'], 
 '2006-07-13', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-malaysia/', 14, true),

-- 日ベトナムEPA（2009年発効）
('jvn-epa', '日ベトナムEPA（日ベトナム経済連携協定）', 'Japan-Viet Nam Economic Partnership Agreement',
 ARRAY['JP','VN'], 
 '2009-10-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-vietnam/', 15, true),

-- 日モンゴルEPA（2016年発効）
('jmn-epa', '日モンゴルEPA（日モンゴル経済連携協定）', 'Japan-Mongolia Economic Partnership Agreement',
 ARRAY['JP','MN'], 
 '2016-06-07', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-mongolia/', 16, true),

-- 日トルコEPA（交渉中）
('jtr-epa', '日トルコEPA（日トルコ経済連携協定）', 'Japan-Turkey Economic Partnership Agreement',
 ARRAY['JP','TR'], 
 '2025-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-turkey/', 17, false),

-- 日コロンビアEPA（交渉中）
('jco-epa', '日コロンビアEPA（日コロンビア経済連携協定）', 'Japan-Colombia Economic Partnership Agreement',
 ARRAY['JP','CO'], 
 '2025-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-colombia/', 18, false),

-- 日韓EPA（中断中）
('jkr-epa', '日韓EPA（日韓経済連携協定）', 'Japan-Korea Economic Partnership Agreement',
 ARRAY['JP','KR'], 
 '2025-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-korea/', 19, false),

-- 日中韓FTA（交渉中）
('jck-fta', '日中韓FTA（日中韓自由貿易協定）', 'Japan-China-Korea Free Trade Agreement',
 ARRAY['JP','CN','KR'], 
 '2025-01-01', 'https://www.mofa.go.jp/mofaj/gaiko/fta/jck/', 20, false);