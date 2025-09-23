-- Trade Lens Database Security
-- RLS (Row Level Security) ポリシー設定

-- RLS有効化
ALTER TABLE hs_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- 読み取り許可ポリシー（全テーブル公開読み取り可能）
CREATE POLICY "Allow public read access" ON hs_codes 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON agreements 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON tariff_rates 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON search_history 
  FOR SELECT USING (true);

-- 検索履歴の書き込み許可（匿名ユーザーも可能）
CREATE POLICY "Allow public insert" ON search_history 
  FOR INSERT WITH CHECK (true);

-- 管理者のみ書き込み許可（HS codes, agreements, tariff_rates）
CREATE POLICY "Allow admin write access" ON hs_codes 
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Allow admin write access" ON agreements 
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Allow admin write access" ON tariff_rates 
  FOR ALL USING (auth.role() = 'admin');