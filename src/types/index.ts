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