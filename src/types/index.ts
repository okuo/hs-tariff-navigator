export interface HSCode {
  code: string;
  description_ja: string;
  description_en: string;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface Agreement {
  id: string;
  name_ja: string;
  name_en: string;
  countries: string[];
  effective_date: string;
  document_url: string;
  priority: number;
  is_active: boolean;
}

export interface TariffRate {
  id: number;
  hs_code: string;
  agreement_id: string;
  from_country: string;
  to_country: string;
  rate: number;
  conditions: Record<string, any>;
  effective_from: string;
  effective_to?: string;
}

export interface SearchHistory {
  id: string;
  session_id: string;
  hs_code: string;
  from_country: string;
  to_country: string;
  selected_agreement?: string;
  savings_amount?: number;
  created_at: string;
}

export interface AgreementRate {
  agreement: Agreement;
  rate: number;
  savings_amount: number;
  savings_percentage: number;
  conditions?: Record<string, any> | null;
}

export interface OptimizationResult {
  hs_code: string;
  from_country: string;
  to_country: string;
  trade_value: number;
  base_rate: number;
  agreements: AgreementRate[];
  best_agreement?: AgreementRate;
}

export interface SearchFilters {
  from_country: string;
  to_country: string;
  trade_value?: number;
}

export type TradeDirection = 'import' | 'export';

export interface CountryOption {
  code: string;
  name: string;
  name_ja: string;
  name_en: string;
}

export interface SearchHistoryEntry {
  id: string;
  hs_code: string;
  country_from: string;
  country_to: string;
  trade_value: number | null;
  search_results: OptimizationResult;
  created_at: string;
}

export interface SearchHistoryForDisplay {
  id: string;
  hs_code: string;
  from_country: string;
  to_country: string;
  trade_value: number | null;
  best_agreement_name?: string;
  savings_amount?: number;
  timestamp: string;
}

export interface CertificationType {
  type: string;
  name_ja: string;
  name_en: string;
  description: string;
}

export interface OriginRule {
  agreement_id: string;
  certification_types: CertificationType[];
  required_documents: string[];
  key_rules: string[];
  value_content_threshold: string;
  notes: string;
  reference_url: string;
}

export interface OriginRulesData {
  version: string;
  updated_at: string;
  data: Record<string, OriginRule>;
}
