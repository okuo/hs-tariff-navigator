import { getSupabaseClient, isSupabaseAvailable } from './supabase';
import { HSCode, OptimizationResult, AgreementRate, Agreement } from '@/types';

// デモデータ（Supabase未設定時に使用）
const demoHSCodes: HSCode[] = [
  {
    code: '8507100000',
    description_ja: '鉛蓄電池（始動用）',
    description_en: 'Lead-acid accumulators for starting piston engines',
    unit: 'NO',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    code: '8507200000', 
    description_ja: '鉛蓄電池（その他）',
    description_en: 'Other lead-acid accumulators',
    unit: 'NO',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    code: '8471300000',
    description_ja: '携帯用自動データ処理機械',
    description_en: 'Portable automatic data processing machines',
    unit: 'NO',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    code: '6203423000',
    description_ja: '男子用ズボン（綿製）',
    description_en: 'Men\'s trousers of cotton',
    unit: 'NO',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    code: '8703232900',
    description_ja: '乗用自動車（ガソリン車、1500cc以下）',
    description_en: 'Passenger motor cars with gasoline engines (≤1500cc)',
    unit: 'NO',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
];

// デモ協定データ
const demoAgreements: Agreement[] = [
  {
    id: 'rcep',
    name_ja: 'RCEP（地域的な包括的経済連携）',
    name_en: 'Regional Comprehensive Economic Partnership',
    countries: ['JP', 'CN', 'KR', 'TH', 'VN', 'MY', 'SG', 'ID', 'PH', 'AU', 'NZ'],
    effective_date: '2022-01-01',
    document_url: 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-eacepa/',
    priority: 1,
    is_active: true
  },
  {
    id: 'cptpp',
    name_ja: 'CPTPP（環太平洋パートナーシップ協定）',
    name_en: 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
    countries: ['JP', 'AU', 'CA', 'CL', 'MX', 'NZ', 'PE', 'SG', 'VN', 'MY'],
    effective_date: '2018-12-30',
    document_url: 'https://www.mofa.go.jp/mofaj/gaiko/fta/tpp/',
    priority: 2,
    is_active: true
  },
  {
    id: 'jaepa',
    name_ja: '日豪EPA（日豪経済連携協定）',
    name_en: 'Japan-Australia Economic Partnership Agreement',
    countries: ['JP', 'AU'],
    effective_date: '2015-01-15',
    document_url: 'https://www.mofa.go.jp/mofaj/gaiko/fta/j-a/',
    priority: 3,
    is_active: true
  }
];

/**
 * HSコード検索
 */
export async function searchHSCodes(searchTerm: string, limit = 10): Promise<HSCode[]> {
  if (!isSupabaseAvailable()) {
    // デモモード：ローカルデータで検索
    console.warn('Supabase未設定：デモモードで動作中');
    return demoHSCodes.filter(item => 
      item.code.includes(searchTerm) || 
      item.description_ja.includes(searchTerm) ||
      item.description_en.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, limit);
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client initialization failed');

    // Supabaseの関数を呼び出し
    const { data, error } = await supabase.rpc('search_hs_codes' as any, {
      search_term: searchTerm,
      limit_count: limit
    } as any);

    if (error) throw error;

    // 結果をHSCode型に変換
    return (data as any[]).map((item: any) => ({
      code: item.code,
      description_ja: item.description_ja,
      description_en: item.description_en,
      unit: item.unit,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

  } catch (error) {
    console.error('HSコード検索エラー:', error);
    
    // エラー時はデモデータで検索
    return demoHSCodes.filter(item => 
      item.code.includes(searchTerm) || 
      item.description_ja.includes(searchTerm) ||
      item.description_en.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, limit);
  }
}

/**
 * 関税最適化計算
 */
export async function optimizeTariff(
  hsCode: string, 
  fromCountry: string, 
  toCountry: string, 
  tradeValue: number = 0
): Promise<OptimizationResult> {
  
  if (!isSupabaseAvailable()) {
    // デモモード：モックデータを返す
    console.warn('Supabase未設定：デモモードで動作中');
    return generateDemoOptimizationResult(hsCode, fromCountry, toCountry, tradeValue);
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client initialization failed');

    // Supabaseの最適化関数を呼び出し
    const { data, error } = await supabase.rpc('optimize_tariff' as any, {
      p_hs_code: hsCode,
      p_from_country: fromCountry,
      p_to_country: toCountry,
      p_trade_value: tradeValue || null
    } as any);

    if (error) throw error;

    return data as OptimizationResult;

  } catch (error) {
    console.error('関税最適化エラー:', error);
    
    // エラー時はデモデータを返す
    return generateDemoOptimizationResult(hsCode, fromCountry, toCountry, tradeValue);
  }
}

/**
 * デモ用最適化結果生成
 */
function generateDemoOptimizationResult(
  hsCode: string, 
  fromCountry: string, 
  toCountry: string, 
  tradeValue: number
): OptimizationResult {
  
  const baseRate = 10.0; // 基本関税率
  
  // 利用可能な協定をフィルタ
  const availableAgreements = demoAgreements.filter(agreement => 
    agreement.countries.includes(fromCountry) && agreement.countries.includes(toCountry)
  );

  const agreementRates: AgreementRate[] = availableAgreements.map((agreement, index) => {
    const rate = index === 0 ? 0.0 : baseRate * (1 - index * 0.5); // 最初の協定が最優遇
    const savingsAmount = tradeValue > 0 
      ? tradeValue * (baseRate - rate) / 100 
      : 1000 * (baseRate - rate) / baseRate;
    const savingsPercentage = baseRate > 0 ? ((baseRate - rate) / baseRate) * 100 : 0;

    return {
      agreement,
      rate,
      savings_amount: savingsAmount,
      savings_percentage: savingsPercentage,
      conditions: index === 0 ? { origin_requirement: '原産地証明書が必要' } : null
    };
  });

  // 最適協定（削減額が最大のもの）を選択
  const bestAgreement = agreementRates.reduce((best, current) => 
    current.savings_amount > best.savings_amount ? current : best, 
    agreementRates[0]
  );

  return {
    hs_code: hsCode,
    from_country: fromCountry,
    to_country: toCountry,
    base_rate: baseRate,
    agreements: agreementRates,
    best_agreement: bestAgreement,
    trade_value: tradeValue
  };
}

/**
 * 検索履歴保存
 */
export async function saveSearchHistory(
  hsCode: string,
  fromCountry: string,
  toCountry: string,
  tradeValue: number | null,
  searchResults: OptimizationResult
): Promise<void> {
  
  if (!isSupabaseAvailable()) {
    // デモモード：ローカルストレージに保存
    console.warn('Supabase未設定：ローカルストレージに保存');
    const history = getLocalSearchHistory();
    const newEntry = {
      id: Date.now().toString(),
      hs_code: hsCode,
      country_from: fromCountry,
      country_to: toCountry,
      trade_value: tradeValue,
      search_results: searchResults,
      created_at: new Date().toISOString()
    };
    
    history.unshift(newEntry);
    localStorage.setItem('trade-lens-search-history', JSON.stringify(history.slice(0, 50)));
    return;
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase client initialization failed');

    const { error } = await supabase
      .from('search_history')
      .insert({
        hs_code: hsCode,
        country_from: fromCountry,
        country_to: toCountry,
        trade_value: tradeValue,
        search_results: searchResults as any
      } as any);

    if (error) throw error;

  } catch (error) {
    console.error('検索履歴保存エラー:', error);
    // エラー時はローカルストレージに保存
    const history = getLocalSearchHistory();
    const newEntry = {
      id: Date.now().toString(),
      hs_code: hsCode,
      country_from: fromCountry,
      country_to: toCountry,
      trade_value: tradeValue,
      search_results: searchResults,
      created_at: new Date().toISOString()
    };
    
    history.unshift(newEntry);
    localStorage.setItem('trade-lens-search-history', JSON.stringify(history.slice(0, 50)));
  }
}

/**
 * ローカル検索履歴取得
 */
function getLocalSearchHistory(): any[] {
  try {
    const stored = localStorage.getItem('trade-lens-search-history');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('ローカル履歴読み込みエラー:', error);
    return [];
  }
}