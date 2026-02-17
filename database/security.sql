-- HS Tariff Navigator Database Security
-- RLS (Row Level Security) 繝昴Μ繧ｷ繝ｼ險ｭ螳・
-- RLS譛牙柑蛹・ALTER TABLE hs_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- 隱ｭ縺ｿ蜿悶ｊ險ｱ蜿ｯ繝昴Μ繧ｷ繝ｼ・亥・繝・・繝悶Ν蜈ｬ髢玖ｪｭ縺ｿ蜿悶ｊ蜿ｯ閭ｽ・・CREATE POLICY "Allow public read access" ON hs_codes 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON agreements 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON tariff_rates 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON search_history 
  FOR SELECT USING (true);

-- 讀懃ｴ｢螻･豁ｴ縺ｮ譖ｸ縺崎ｾｼ縺ｿ險ｱ蜿ｯ・亥諺蜷阪Θ繝ｼ繧ｶ繝ｼ繧ょ庄閭ｽ・・CREATE POLICY "Allow public insert" ON search_history 
  FOR INSERT WITH CHECK (true);

-- 邂｡逅・・・縺ｿ譖ｸ縺崎ｾｼ縺ｿ險ｱ蜿ｯ・・S codes, agreements, tariff_rates・・CREATE POLICY "Allow admin write access" ON hs_codes 
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Allow admin write access" ON agreements 
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Allow admin write access" ON tariff_rates 
  FOR ALL USING (auth.role() = 'admin');
