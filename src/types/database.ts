export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hs_codes: {
        Row: {
          code: string
          description_ja: string
          description_en: string
          unit: string
          category: string | null
          subcategory: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          code: string
          description_ja: string
          description_en: string
          unit: string
          category?: string | null
          subcategory?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          code?: string
          description_ja?: string
          description_en?: string
          unit?: string
          category?: string | null
          subcategory?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agreements: {
        Row: {
          id: string
          name_ja: string
          name_en: string
          countries: string[]
          effective_date: string
          document_url: string | null
          priority: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name_ja: string
          name_en: string
          countries: string[]
          effective_date: string
          document_url?: string | null
          priority?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_ja?: string
          name_en?: string
          countries?: string[]
          effective_date?: string
          document_url?: string | null
          priority?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tariff_rates: {
        Row: {
          id: string
          hs_code: string
          country_from: string
          country_to: string
          agreement_id: string | null
          base_rate: number
          preferential_rate: number | null
          conditions: Json | null
          effective_date: string
          expires_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hs_code: string
          country_from: string
          country_to: string
          agreement_id?: string | null
          base_rate: number
          preferential_rate?: number | null
          conditions?: Json | null
          effective_date: string
          expires_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hs_code?: string
          country_from?: string
          country_to?: string
          agreement_id?: string | null
          base_rate?: number
          preferential_rate?: number | null
          conditions?: Json | null
          effective_date?: string
          expires_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string | null
          hs_code: string
          country_from: string
          country_to: string
          trade_value: number | null
          search_results: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          hs_code: string
          country_from: string
          country_to: string
          trade_value?: number | null
          search_results: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          hs_code?: string
          country_from?: string
          country_to?: string
          trade_value?: number | null
          search_results?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      optimize_tariff: {
        Args: {
          p_hs_code: string
          p_from_country: string
          p_to_country: string
          p_trade_value?: number
        }
        Returns: Json
      }
      search_hs_codes: {
        Args: {
          search_term: string
          limit_count?: number
        }
        Returns: {
          code: string
          description_ja: string
          description_en: string
          unit: string
          rank: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}