/**
 * Trade Lens API層
 * データサービス、検索、関税最適化の統合インターフェース
 */

import { HSCode, OptimizationResult, SearchHistoryEntry, SearchHistoryForDisplay } from '@/types';
import { dataService } from './dataService';
import { searchHSCodes as searchHS } from './search';
import { optimizeTariff as optimize } from './tariffOptimizer';

// 検索履歴のストレージキー
const SEARCH_HISTORY_KEY = 'trade-lens-search-history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Chrome Storage APIのラッパー
 * 拡張機能環境ではchrome.storage.localを使用し、
 * 非拡張環境（開発時等）ではlocalStorageにフォールバック
 */
async function storageGet(key: string): Promise<any> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] ?? null);
      });
    });
  }
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

async function storageSet(key: string, value: any): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors in non-extension environments
  }
}

async function storageRemove(key: string): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.remove([key], () => {
        resolve();
      });
    });
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors in non-extension environments
  }
}

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
 * 関税最適化計算
 */
export async function optimizeTariff(
  hsCode: string,
  fromCountry: string,
  toCountry: string,
  tradeValue: number = 0
): Promise<OptimizationResult> {
  try {
    const [agreements, tariffRates] = await Promise.all([
      dataService.getAgreements(),
      dataService.getTariffRates(),
    ]);

    return optimize(hsCode, fromCountry, toCountry, tradeValue || null, {
      agreements,
      tariffRates,
    });
  } catch (error) {
    console.error('関税最適化エラー:', error);

    // エラー時はデフォルト結果を返す
    return {
      hs_code: hsCode,
      from_country: fromCountry,
      to_country: toCountry,
      base_rate: 10.0,
      agreements: [],
      best_agreement: undefined,
      trade_value: tradeValue,
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
    const history = await getLocalSearchHistory();
    const newEntry: SearchHistoryEntry = {
      id: Date.now().toString(),
      hs_code: hsCode,
      country_from: fromCountry,
      country_to: toCountry,
      trade_value: tradeValue,
      search_results: searchResults,
      created_at: new Date().toISOString(),
    };

    history.unshift(newEntry);
    await storageSet(SEARCH_HISTORY_KEY, history.slice(0, MAX_HISTORY_ITEMS));
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
 * 検索履歴クリア
 */
export async function clearSearchHistory(): Promise<void> {
  try {
    await storageRemove(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('検索履歴クリアエラー:', error);
  }
}

/**
 * ローカル検索履歴取得
 */
async function getLocalSearchHistory(): Promise<SearchHistoryEntry[]> {
  try {
    const stored = await storageGet(SEARCH_HISTORY_KEY);
    return stored ?? [];
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
    console.log('Trade Lens: データ初期化完了');
  } catch (error) {
    console.error('Trade Lens: データ初期化エラー:', error);
  }
}

/**
 * データの更新（バックグラウンドで定期的に呼び出し）
 */
export async function refreshData(): Promise<void> {
  try {
    await dataService.refresh();
    console.log('Trade Lens: データ更新完了');
  } catch (error) {
    console.error('Trade Lens: データ更新エラー:', error);
  }
}
