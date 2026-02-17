-- HS Tariff Navigator Database Functions
-- 繧ｹ繝医い繝峨ヵ繧｡繝ｳ繧ｯ繧ｷ繝ｧ繝ｳ螳夂ｾｩ

-- pg_trgm諡｡蠑ｵ繧呈怏蜉ｹ蛹厄ｼ磯｡樔ｼｼ蠎ｦ讀懃ｴ｢逕ｨ・・CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- HS繧ｳ繝ｼ繝画､懃ｴ｢髢｢謨ｰ
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

-- 髢｢遞取怙驕ｩ蛹夜未謨ｰ
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
  -- 驕ｩ逕ｨ蜿ｯ閭ｽ縺ｪ蜊泌ｮ壹ｒ蜿門ｾ・  FOR current_agreement IN
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
    -- 蜆ｪ驕・ｨ守紫縺瑚ｨｭ螳壹＆繧後※縺・ｋ蝣ｴ蜷医・縺昴ｌ繧剃ｽｿ逕ｨ縲√↑縺代ｌ縺ｰ謗ｨ螳壼､
    IF current_agreement.preferential_rate IS NOT NULL THEN
      base_tariff := current_agreement.base_rate;
    ELSE
      -- 繝・ヵ繧ｩ繝ｫ繝域耳螳壼､繧剃ｽｿ逕ｨ
      current_agreement.preferential_rate := GREATEST(0, base_tariff * (1 - current_agreement.priority * 0.3));
      current_agreement.base_rate := base_tariff;
    END IF;
    
    -- 蜑頑ｸ幃｡崎ｨ育ｮ・    IF p_trade_value IS NOT NULL AND p_trade_value > 0 THEN
      savings_amount := (p_trade_value * (current_agreement.base_rate - current_agreement.preferential_rate) / 100)::BIGINT;
    ELSE
      savings_amount := (1000000 * (current_agreement.base_rate - current_agreement.preferential_rate) / 100)::BIGINT;
    END IF;
    
    savings_percentage := (current_agreement.base_rate - current_agreement.preferential_rate) / current_agreement.base_rate * 100;
    
    -- 蜊泌ｮ壹ョ繝ｼ繧ｿ繧帝・蛻励↓霑ｽ蜉
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
    
    -- 譛濶ｯ縺ｮ蜊泌ｮ壹ｒ驕ｸ謚橸ｼ亥炎貂幃｡阪′譛螟ｧ・・    IF best_agreement IS NULL OR savings_amount > (best_agreement->>'savings_amount')::BIGINT THEN
      best_agreement := agreement_data[array_length(agreement_data, 1)];
    END IF;
  END LOOP;
  
  -- 邨先棡繧呈ｧ狗ｯ・  result := jsonb_build_object(
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

-- 蝗ｽ蛻･蜊泌ｮ壽､懃ｴ｢髢｢謨ｰ
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
