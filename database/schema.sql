-- Trade Lens Database Schema
-- Supabaseで実行するSQLスクリプト

-- 必要な拡張を有効化
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- HSコードマスターテーブル
CREATE TABLE hs_codes (
  code VARCHAR(10) PRIMARY KEY,
  description_ja TEXT NOT NULL,
  description_en TEXT NOT NULL,
  unit VARCHAR(10) NOT NULL,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FTA/EPA協定マスターテーブル  
CREATE TABLE agreements (
  id VARCHAR(20) PRIMARY KEY,
  name_ja VARCHAR(200) NOT NULL,
  name_en VARCHAR(200) NOT NULL,
  countries TEXT[] NOT NULL,
  effective_date DATE NOT NULL,
  document_url TEXT,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 関税率テーブル
CREATE TABLE tariff_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hs_code VARCHAR(10) REFERENCES hs_codes(code),
  country_from VARCHAR(2) NOT NULL,
  country_to VARCHAR(2) NOT NULL,
  agreement_id VARCHAR(20) REFERENCES agreements(id),
  base_rate DECIMAL(5,2) NOT NULL,
  preferential_rate DECIMAL(5,2),
  conditions JSONB,
  effective_date DATE NOT NULL,
  expires_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 検索履歴テーブル
CREATE TABLE search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  hs_code VARCHAR(10) NOT NULL,
  country_from VARCHAR(2) NOT NULL,
  country_to VARCHAR(2) NOT NULL,
  trade_value BIGINT,
  search_results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_hs_codes_code ON hs_codes(code);
CREATE INDEX idx_hs_codes_description_ja ON hs_codes USING gin(description_ja gin_trgm_ops);
CREATE INDEX idx_hs_codes_description_en ON hs_codes USING gin(description_en gin_trgm_ops);
CREATE INDEX idx_tariff_rates_hs_code ON tariff_rates(hs_code);
CREATE INDEX idx_tariff_rates_countries ON tariff_rates(country_from, country_to);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);