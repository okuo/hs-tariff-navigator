-- Trade Lens Database Functions
-- ストアドファンクション定義

-- pg_trgm拡張を有効化（類似度検索用）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- HSコード検索関数
CREATE OR REPLACE FUNCTION search_hs_codes(
  search_term TEXT,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  code VARCHAR(10),
  description_ja TEXT,
  description_en TEXT,
  unit VARCHAR(10),
  rank FLOAT
)
LANGUAGE SQL
AS $$
  SELECT 
    h.code,
    h.description_ja,
    h.description_en,
    h.unit,
    GREATEST(
      similarity(h.code, search_term) * 3.0,
      similarity(h.description_ja, search_term) * 2.0,
      similarity(h.description_en, search_term) * 1.5
    ) as rank
  FROM hs_codes h
  WHERE 
    h.code ILIKE '%' || search_term || '%'
    OR h.description_ja ILIKE '%' || search_term || '%'
    OR h.description_en ILIKE '%' || search_term || '%'
    OR similarity(h.code, search_term) > 0.1
    OR similarity(h.description_ja, search_term) > 0.1
    OR similarity(h.description_en, search_term) > 0.1
  ORDER BY rank DESC, h.code
  LIMIT limit_count;
$$;

-- 関税最適化関数
CREATE OR REPLACE FUNCTION optimize_tariff(
  p_hs_code VARCHAR(10),
  p_from_country VARCHAR(2),
  p_to_country VARCHAR(2),
  p_trade_value BIGINT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE PLPGSQL
AS $$
DECLARE
  result JSONB;
  base_tariff DECIMAL(5,2) := 10.0;
  agreement_data JSONB[];
  best_agreement JSONB;
  current_agreement RECORD;
  savings_amount BIGINT;
  savings_percentage FLOAT;
BEGIN
  -- 適用可能な協定を取得
  FOR current_agreement IN
    SELECT a.*, tr.preferential_rate, tr.base_rate, tr.conditions
    FROM agreements a
    LEFT JOIN tariff_rates tr ON tr.agreement_id = a.id 
      AND tr.hs_code = p_hs_code
      AND tr.country_from = p_from_country 
      AND tr.country_to = p_to_country
    WHERE a.is_active = true
      AND p_from_country = ANY(a.countries)
      AND p_to_country = ANY(a.countries)
    ORDER BY a.priority
  LOOP
    -- 優遇税率が設定されている場合はそれを使用、なければ推定値
    IF current_agreement.preferential_rate IS NOT NULL THEN
      base_tariff := current_agreement.base_rate;
    ELSE
      -- デフォルト推定値を使用
      current_agreement.preferential_rate := GREATEST(0, base_tariff * (1 - current_agreement.priority * 0.3));
      current_agreement.base_rate := base_tariff;
    END IF;
    
    -- 削減額計算
    IF p_trade_value IS NOT NULL AND p_trade_value > 0 THEN
      savings_amount := (p_trade_value * (current_agreement.base_rate - current_agreement.preferential_rate) / 100)::BIGINT;
    ELSE
      savings_amount := (1000000 * (current_agreement.base_rate - current_agreement.preferential_rate) / 100)::BIGINT;
    END IF;
    
    savings_percentage := (current_agreement.base_rate - current_agreement.preferential_rate) / current_agreement.base_rate * 100;
    
    -- 協定データを配列に追加
    agreement_data := agreement_data || jsonb_build_object(
      'agreement', jsonb_build_object(
        'id', current_agreement.id,
        'name_ja', current_agreement.name_ja,
        'name_en', current_agreement.name_en,
        'countries', current_agreement.countries,
        'effective_date', current_agreement.effective_date,
        'priority', current_agreement.priority
      ),
      'rate', current_agreement.preferential_rate,
      'savings_amount', savings_amount,
      'savings_percentage', savings_percentage,
      'conditions', current_agreement.conditions
    );
    
    -- 最良の協定を選択（削減額が最大）
    IF best_agreement IS NULL OR savings_amount > (best_agreement->>'savings_amount')::BIGINT THEN
      best_agreement := agreement_data[array_length(agreement_data, 1)];
    END IF;
  END LOOP;
  
  -- 結果を構築
  result := jsonb_build_object(
    'hs_code', p_hs_code,
    'from_country', p_from_country,
    'to_country', p_to_country,
    'base_rate', base_tariff,
    'agreements', COALESCE(agreement_data, '[]'::JSONB),
    'best_agreement', best_agreement,
    'trade_value', p_trade_value
  );
  
  RETURN result;
END;
$$;

-- 国別協定検索関数
CREATE OR REPLACE FUNCTION get_agreements_by_countries(
  p_from_country VARCHAR(2),
  p_to_country VARCHAR(2)
)
RETURNS TABLE (
  id VARCHAR(20),
  name_ja VARCHAR(200),
  name_en VARCHAR(200),
  priority INTEGER,
  effective_date DATE
)
LANGUAGE SQL
AS $$
  SELECT a.id, a.name_ja, a.name_en, a.priority, a.effective_date
  FROM agreements a
  WHERE a.is_active = true
    AND p_from_country = ANY(a.countries)
    AND p_to_country = ANY(a.countries)
  ORDER BY a.priority;
$$;