export const COUNTRIES = [
  { code: 'JP', name_ja: '日本', name_en: 'Japan' },
  { code: 'US', name_ja: 'アメリカ', name_en: 'United States' },
  { code: 'CN', name_ja: '中国', name_en: 'China' },
  { code: 'KR', name_ja: '韓国', name_en: 'South Korea' },
  { code: 'TW', name_ja: '台湾', name_en: 'Taiwan' },
  { code: 'BN', name_ja: 'ブルネイ', name_en: 'Brunei' },
  { code: 'KH', name_ja: 'カンボジア', name_en: 'Cambodia' },
  { code: 'LA', name_ja: 'ラオス', name_en: 'Laos' },
  { code: 'MM', name_ja: 'ミャンマー', name_en: 'Myanmar' },
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
  { code: 'EU', name_ja: 'EU', name_en: 'European Union' },
  { code: 'DE', name_ja: 'ドイツ', name_en: 'Germany' },
  { code: 'FR', name_ja: 'フランス', name_en: 'France' },
  { code: 'IT', name_ja: 'イタリア', name_en: 'Italy' },
  { code: 'ES', name_ja: 'スペイン', name_en: 'Spain' },
  { code: 'NL', name_ja: 'オランダ', name_en: 'Netherlands' },
  { code: 'BE', name_ja: 'ベルギー', name_en: 'Belgium' },
  { code: 'AT', name_ja: 'オーストリア', name_en: 'Austria' },
  { code: 'PL', name_ja: 'ポーランド', name_en: 'Poland' },
  { code: 'RO', name_ja: 'ルーマニア', name_en: 'Romania' },
  { code: 'GR', name_ja: 'ギリシャ', name_en: 'Greece' },
  { code: 'PT', name_ja: 'ポルトガル', name_en: 'Portugal' },
  { code: 'CZ', name_ja: 'チェコ', name_en: 'Czech Republic' },
  { code: 'HU', name_ja: 'ハンガリー', name_en: 'Hungary' },
  { code: 'SE', name_ja: 'スウェーデン', name_en: 'Sweden' },
  { code: 'BG', name_ja: 'ブルガリア', name_en: 'Bulgaria' },
  { code: 'DK', name_ja: 'デンマーク', name_en: 'Denmark' },
  { code: 'FI', name_ja: 'フィンランド', name_en: 'Finland' },
  { code: 'SK', name_ja: 'スロバキア', name_en: 'Slovakia' },
  { code: 'HR', name_ja: 'クロアチア', name_en: 'Croatia' },
  { code: 'IE', name_ja: 'アイルランド', name_en: 'Ireland' },
  { code: 'LT', name_ja: 'リトアニア', name_en: 'Lithuania' },
  { code: 'SI', name_ja: 'スロベニア', name_en: 'Slovenia' },
  { code: 'LV', name_ja: 'ラトビア', name_en: 'Latvia' },
  { code: 'EE', name_ja: 'エストニア', name_en: 'Estonia' },
  { code: 'CY', name_ja: 'キプロス', name_en: 'Cyprus' },
  { code: 'LU', name_ja: 'ルクセンブルク', name_en: 'Luxembourg' },
  { code: 'MT', name_ja: 'マルタ', name_en: 'Malta' },
  { code: 'CH', name_ja: 'スイス', name_en: 'Switzerland' },
  { code: 'MN', name_ja: 'モンゴル', name_en: 'Mongolia' },
  { code: 'TR', name_ja: 'トルコ', name_en: 'Turkey' },
  { code: 'CO', name_ja: 'コロンビア', name_en: 'Colombia' },
  { code: 'BR', name_ja: 'ブラジル', name_en: 'Brazil' }
];

export const EU_MEMBER_CODES = [
  'AT',
  'BE',
  'BG',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
] as const;

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
    id: 'jepa',
    name_ja: '日EU経済連携協定',
    name_en: 'Japan-EU Economic Partnership Agreement',
    priority: 3
  },
  {
    id: 'jusmca',
    name_ja: '日米貿易協定',
    name_en: 'US-Japan Trade Agreement',
    priority: 4
  },
  {
    id: 'juk-epa',
    name_ja: '日英包括的経済連携協定',
    name_en: 'Japan-UK Comprehensive Economic Partnership Agreement',
    priority: 5
  }
];

export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'tariff-scope-search-history',
  USER_SETTINGS: 'user_settings',
  CACHE_EXPIRY: 'cache_expiry',
  PENDING_HS_CODE: 'tariff-scope-pending-hs-code'
} as const;

export const API_ENDPOINTS = {
  SEARCH_HS_CODE: 'search-hs-code',
  OPTIMIZE_FTA: 'optimize-fta',
  GET_AGREEMENTS: 'get-agreements'
} as const;

export const TRADE_RELATED_DOMAINS = [
  'jetro.go.jp',
  'customs.go.jp',
  'meti.go.jp',
  'mofa.go.jp',
  'tradestats.go.jp',
  'alibaba.com',
  'made-in-china.com',
  'globalsources.com'
] as const;

export const CONTENT_SCRIPT_CONFIG = {
  DEBOUNCE_MS: 300,
  MAX_NODE_COUNT: 10000
} as const;
