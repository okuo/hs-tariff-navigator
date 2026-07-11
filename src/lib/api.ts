/**
 * TariffScope API層
 * データサービス、検索、関税最適化の統合インターフェース
 */

import {
  DataStatus,
  HSCode,
  OptimizationResult,
  PendingHSCodeSelection,
  SearchHistoryEntry,
  SearchHistoryForDisplay
} from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { dataService, getManifestDataReference } from './dataService';
import { searchHistoryRepository } from './searchHistoryRepository';
import { searchHSCodes as searchHS } from './search';
import { extensionStorage } from './storage';
import { optimizeTariff as optimize } from './tariffOptimizer';

/**
 * HSコード検索
 */
export async function searchHSCodes(searchTerm: string, limit = 10): Promise<HSCode[]> {
  try {
    const hsCodeData = await dataService.getHSCodes();
    const results = searchHS(searchTerm, hsCodeData, limit);

    // SearchResult から HSCode に変換
    return results.map((item) => ({
      code: item.code,
      description_ja: item.description_ja,
      description_en: item.description_en,
      unit: item.unit,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('HSコード検索エラー:', error);
    return [];
  }
}

/**
 * コンテンツスクリプトでクリックされたHSコードを取得してクリア
 */
export async function consumePendingHSCodeSelection(): Promise<PendingHSCodeSelection | null> {
  try {
    const pending = await extensionStorage.get<PendingHSCodeSelection>(STORAGE_KEYS.PENDING_HS_CODE);
    if (!pending?.hsCode) {
      return null;
    }
    await extensionStorage.remove(STORAGE_KEYS.PENDING_HS_CODE);
    return pending;
  } catch (error) {
    console.error('クリック済みHSコードの取得に失敗:', error);
    return null;
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
  try {
    const data = await dataService.getData();

    return optimize(hsCode, fromCountry, toCountry, tradeValue || null, {
      agreements: data.agreements,
      tariffRates: data.tariff_rates,
      manifest: data.manifest,
    });
  } catch (error) {
    console.error('関税最適化エラー:', error);

    // エラー時はデフォルト結果を返す
    return {
      hs_code: hsCode,
      from_country: fromCountry,
      to_country: toCountry,
      base_rate: 10.0,
      base_rate_source: 'default',
      agreements: [],
      best_agreement: undefined,
      trade_value: tradeValue,
      data_warnings: ['データ読み込みエラーのため、参考用の空結果を返しています。'],
    };
  }
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
  try {
    const newEntry: SearchHistoryEntry = {
      id: Date.now().toString(),
      hs_code: hsCode,
      country_from: fromCountry,
      country_to: toCountry,
      trade_value: tradeValue,
      search_results: searchResults,
      created_at: new Date().toISOString(),
    };

    await searchHistoryRepository.add(newEntry);
  } catch (error) {
    console.error('検索履歴保存エラー:', error);
  }
}

/**
 * 検索履歴取得（UI用に変換）
 */
export async function getSearchHistory(): Promise<SearchHistoryForDisplay[]> {
  const entries = await getLocalSearchHistory();
  return entries.map(entry => ({
    id: entry.id,
    hs_code: entry.hs_code,
    from_country: entry.country_from,
    to_country: entry.country_to,
    trade_value: entry.trade_value,
    best_agreement_name: entry.search_results?.best_agreement?.agreement?.name_ja,
    savings_amount: entry.search_results?.best_agreement?.savings_amount,
    timestamp: entry.created_at,
  }));
}

/**
 * 検索履歴取得（生データ）
 */
export async function getSearchHistoryRaw(): Promise<SearchHistoryEntry[]> {
  return getLocalSearchHistory();
}

/**
 * データ鮮度・件数情報を取得
 */
export async function getDataStatus(): Promise<DataStatus> {
  const data = await dataService.getData();
  const dataReference = getManifestDataReference(data.manifest);
  const source = data.manifest.source?.type ?? 'bundled';

  return {
    version: data.manifest.version,
    data_updated_at: data.manifest.updated_at,
    cached_at: data.cached_at,
    source,
    source_name: dataReference.source_name,
    source_url: dataReference.source_url,
    source_note: dataReference.source_note,
    last_verified_at: dataReference.last_verified_at,
    effective_from: dataReference.effective_from,
    effective_to: dataReference.effective_to,
    remote_updates_enabled: Boolean(data.manifest.remote?.enabled && data.manifest.remote.base_url),
    counts: {
      hs_codes: data.manifest.files.hs_codes.count ?? data.hs_codes.length,
      agreements: data.manifest.files.agreements.count ?? data.agreements.length,
      tariff_rates: data.manifest.files.tariff_rates.count ?? data.tariff_rates.length,
    },
  };
}

/**
 * 検索履歴クリア
 */
export async function clearSearchHistory(): Promise<void> {
  try {
    await searchHistoryRepository.clear();
  } catch (error) {
    console.error('検索履歴クリアエラー:', error);
  }
}

/**
 * ローカル検索履歴取得
 */
async function getLocalSearchHistory(): Promise<SearchHistoryEntry[]> {
  try {
    return await searchHistoryRepository.getAll();
  } catch (error) {
    console.error('ローカル履歴読み込みエラー:', error);
    return [];
  }
}

/**
 * データの初期化（拡張機能起動時に呼び出し）
 */
export async function initializeData(): Promise<void> {
  try {
    await dataService.getData();
    console.log('TariffScope: データ初期化完了');
  } catch (error) {
    console.error('TariffScope: データ初期化エラー:', error);
  }
}

/**
 * データの更新（バックグラウンドで定期的に呼び出し）
 */
export async function refreshData(): Promise<void> {
  try {
    await dataService.refresh();
    console.log('TariffScope: データ更新完了');
  } catch (error) {
    console.error('TariffScope: データ更新エラー:', error);
  }
}
