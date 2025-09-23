export const COUNTRIES = [
  { code: 'JP', name_ja: '日本', name_en: 'Japan' },
  { code: 'US', name_ja: 'アメリカ', name_en: 'United States' },
  { code: 'CN', name_ja: '中国', name_en: 'China' },
  { code: 'KR', name_ja: '韓国', name_en: 'South Korea' },
  { code: 'TW', name_ja: '台湾', name_en: 'Taiwan' },
  { code: 'TH', name_ja: 'タイ', name_en: 'Thailand' },
  { code: 'VN', name_ja: 'ベトナム', name_en: 'Vietnam' },
  { code: 'MY', name_ja: 'マレーシア', name_en: 'Malaysia' },
  { code: 'SG', name_ja: 'シンガポール', name_en: 'Singapore' },
  { code: 'ID', name_ja: 'インドネシア', name_en: 'Indonesia' },
  { code: 'PH', name_ja: 'フィリピン', name_en: 'Philippines' },
  { code: 'IN', name_ja: 'インド', name_en: 'India' },
  { code: 'AU', name_ja: 'オーストラリア', name_en: 'Australia' },
  { code: 'NZ', name_ja: 'ニュージーランド', name_en: 'New Zealand' },
  { code: 'CA', name_ja: 'カナダ', name_en: 'Canada' },
  { code: 'MX', name_ja: 'メキシコ', name_en: 'Mexico' },
  { code: 'PE', name_ja: 'ペルー', name_en: 'Peru' },
  { code: 'CL', name_ja: 'チリ', name_en: 'Chile' },
  { code: 'GB', name_ja: 'イギリス', name_en: 'United Kingdom' },
  { code: 'EU', name_ja: 'EU', name_en: 'European Union' }
];

export const MAJOR_AGREEMENTS = [
  {
    id: 'rcep',
    name_ja: 'RCEP（地域的な包括的経済連携）',
    name_en: 'Regional Comprehensive Economic Partnership',
    priority: 1
  },
  {
    id: 'cptpp',
    name_ja: 'CPTPP（環太平洋パートナーシップ協定）',
    name_en: 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
    priority: 2
  },
  {
    id: 'jeu',
    name_ja: '日EU経済連携協定',
    name_en: 'Japan-EU Economic Partnership Agreement',
    priority: 3
  },
  {
    id: 'usjta',
    name_ja: '日米貿易協定',
    name_en: 'US-Japan Trade Agreement',
    priority: 4
  },
  {
    id: 'juk',
    name_ja: '日英包括的経済連携協定',
    name_en: 'Japan-UK Comprehensive Economic Partnership Agreement',
    priority: 5
  }
];

export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'search_history',
  USER_SETTINGS: 'user_settings',
  CACHE_EXPIRY: 'cache_expiry'
} as const;

export const API_ENDPOINTS = {
  SEARCH_HS_CODE: 'search-hs-code',
  OPTIMIZE_FTA: 'optimize-fta',
  GET_AGREEMENTS: 'get-agreements'
} as const;