import React, { useState, useEffect, useRef } from 'react';
import { HSCode, SearchFilters, OptimizationResult } from '@/types';
import { COUNTRIES } from '@/utils/constants';
import { searchHSCodes, optimizeTariff, saveSearchHistory } from '@/lib/api';
import {
  ChromeAiAvailability,
  ChromeAiKeywordSuggestion,
  generateHsSearchKeywordsWithChromeAi,
  getChromeAiAvailability,
} from '@/lib/chromeBuiltInAi';

interface PrefilledData {
  hsCode: string;
  fromCountry: string;
  toCountry: string;
  tradeValue: number;
  sourceUrl?: string;
  sourceContext?: string | null;
  detectedAt?: string;
}

interface HSCodeSearchProps {
  onHSCodeSelect: (hsCode: string) => void;
  onOptimizationResult: (result: OptimizationResult) => void;
  prefilledData?: PrefilledData | null;
  onPrefilledDataUsed?: () => void;
}

const normalizeHSCodeDigits = (value: string) => value.replace(/[^0-9]/g, '');

const isSameHSCode = (left: string, right: string) => {
  const leftDigits = normalizeHSCodeDigits(left);
  const rightDigits = normalizeHSCodeDigits(right);
  return left === right || (!!leftDigits && leftDigits === rightDigits);
};

const formatSourceUrl = (url?: string) => {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return url;
  }
};

const HSCodeSearch: React.FC<HSCodeSearchProps> = ({
  onHSCodeSelect,
  onOptimizationResult,
  prefilledData,
  onPrefilledDataUsed
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<HSCode[]>([]);
  const [selectedHSCode, setSelectedHSCode] = useState<HSCode | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    from_country: 'JP',
    to_country: 'CN',
    trade_value: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<{ tradeValue?: string; hsCode?: string }>({});
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [sourceInfo, setSourceInfo] = useState<{ url?: string; context?: string | null } | null>(null);
  const [localLlmDescription, setLocalLlmDescription] = useState('');
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [localLlmSuggestion, setLocalLlmSuggestion] = useState<ChromeAiKeywordSuggestion | null>(null);
  const [localLlmStatus, setLocalLlmStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [chromeAiAvailability, setChromeAiAvailability] = useState<ChromeAiAvailability | null>(null);
  const [chromeAiDownloadProgress, setChromeAiDownloadProgress] = useState<number | null>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    getChromeAiAvailability().then((availability) => {
      if (!cancelled) {
        setChromeAiAvailability(availability);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // 履歴やページ上で選択されたHSコードを復元
  useEffect(() => {
    if (prefilledData) {
      let cancelled = false;
      const fallbackHSCode: HSCode = {
        code: prefilledData.hsCode,
        description_ja: '',
        description_en: '',
        unit: '',
        created_at: '',
        updated_at: ''
      };

      setSearchTerm(prefilledData.hsCode);
      setSelectedHSCode(fallbackHSCode);
      setFilters({
        from_country: prefilledData.fromCountry,
        to_country: prefilledData.toCountry,
        trade_value: prefilledData.tradeValue || 0
      });
      setSuggestions([]);
      setSelectedIndex(-1);
      setErrors({});
      setSourceInfo(
        prefilledData.sourceUrl || prefilledData.sourceContext
          ? { url: prefilledData.sourceUrl, context: prefilledData.sourceContext }
          : null
      );
      onHSCodeSelect(prefilledData.hsCode);

      const hydrateHSCode = async () => {
        try {
          const results = await searchHSCodes(prefilledData.hsCode, 10);
          const exactMatch = results.find((item) => isSameHSCode(item.code, prefilledData.hsCode));
          const matchedHSCode = exactMatch ?? results[0];
          if (!cancelled && matchedHSCode) {
            setSelectedHSCode(matchedHSCode);
            setSearchTerm(matchedHSCode.code);
            onHSCodeSelect(matchedHSCode.code);
          }
        } finally {
          if (!cancelled) {
            onPrefilledDataUsed?.();
          }
        }
      };

      hydrateHSCode();

      return () => {
        cancelled = true;
      };
    }
    return undefined;
  }, [prefilledData, onHSCodeSelect, onPrefilledDataUsed]);

  // 検索処理（デバウンス付き）
  useEffect(() => {
    // 既存のタイマーをクリア
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (searchTerm.length >= 2) {
      setIsSearching(true);
      
      // 新しいタイマーを設定
      const timer = setTimeout(async () => {
        try {
          const results = await searchHSCodes(searchTerm, 5);
          setSuggestions(results);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('HSコード検索エラー:', error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
      
      searchTimerRef.current = timer;
    } else {
      setSuggestions([]);
      setSelectedIndex(-1);
      setIsSearching(false);
    }
    
    // クリーンアップ
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
        searchTimerRef.current = null;
      }
    };
  }, [searchTerm]);

  const handleHSCodeSelect = (hsCode: HSCode) => {
    setSelectedHSCode(hsCode);
    setSearchTerm(hsCode.code);
    setSourceInfo(null);
    setLocalLlmStatus(null);
    setSuggestions([]);
    setSelectedIndex(-1);
    onHSCodeSelect(hsCode.code);
  };

  const handleGenerateSearchKeywords = async () => {
    if (isGeneratingKeywords || chromeAiAvailability === 'unavailable') return;

    setIsGeneratingKeywords(true);
    setLocalLlmStatus(null);
    setChromeAiDownloadProgress(null);

    try {
      const suggestion = await generateHsSearchKeywordsWithChromeAi(
        localLlmDescription,
        setChromeAiDownloadProgress
      );

      setLocalLlmSuggestion(suggestion);
      setSearchTerm(suggestion.search_query);
      setSelectedHSCode(null);
      setSourceInfo(null);
      setSuggestions([]);
      setSelectedIndex(-1);
      setErrors((prev) => ({ ...prev, hsCode: undefined }));
      setLocalLlmStatus({
        type: 'success',
        message: '検索語を作成しました。候補から該当するHSコードを選択してください。',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ローカルLLMで検索語を作成できませんでした。';
      setLocalLlmStatus({ type: 'error', message });
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const refreshChromeAiAvailability = async () => {
    setChromeAiAvailability(null);
    setChromeAiDownloadProgress(null);
    const availability = await getChromeAiAvailability();
    setChromeAiAvailability(availability);
  };

  const getChromeAiStatusLabel = () => {
    switch (chromeAiAvailability) {
      case 'available':
        return '利用可能';
      case 'downloadable':
        return '初回準備あり';
      case 'downloading':
        return '準備中';
      case 'unavailable':
        return '未対応';
      default:
        return '確認中';
    }
  };

  const getChromeAiStatusClassName = () => {
    switch (chromeAiAvailability) {
      case 'available':
        return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'downloadable':
      case 'downloading':
        return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'unavailable':
        return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  const renderKeywordChips = (label: string, terms: string[]) => {
    if (terms.length === 0) {
      return null;
    }

    return (
      <div>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</div>
        <div className="flex flex-wrap gap-1.5">
          {terms.map((term) => (
            <span
              key={`${label}-${term}`}
              className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200"
            >
              {term}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleHSCodeSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  // スクロールして選択中のアイテムを表示
  useEffect(() => {
    if (selectedIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // 貿易額変更ハンドラ（バリデーション付き）
  const handleTradeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0) {
      setErrors((prev) => ({ ...prev, tradeValue: '貿易金額は0以上の数値を入力してください' }));
    } else {
      setErrors((prev) => ({ ...prev, tradeValue: undefined }));
    }
    setFilters({ ...filters, trade_value: value });
  };

  // 最適化実行
  const handleOptimize = async () => {
    if (isLoading) return;

    // バリデーション
    const newErrors: { tradeValue?: string; hsCode?: string } = {};
    if (!selectedHSCode) {
      newErrors.hsCode = 'HSコードを選択してください';
    }
    if (filters.trade_value !== undefined && filters.trade_value < 0) {
      newErrors.tradeValue = '貿易金額は0以上の数値を入力してください';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // selectedHSCode is guaranteed non-null after validation above
    const hsCode = selectedHSCode!;
    setIsLoading(true);

    try {
      const result = await optimizeTariff(
        hsCode.code,
        filters.from_country,
        filters.to_country,
        filters.trade_value
      );

      // 検索履歴を保存
      try {
        await saveSearchHistory(
          hsCode.code,
          filters.from_country,
          filters.to_country,
          filters.trade_value || null,
          result
        );
      } catch (error) {
        console.warn('検索履歴保存に失敗:', error);
      }
      
      onOptimizationResult(result);
    } catch (error) {
      console.error('最適化処理エラー:', error);
      // エラーメッセージをユーザーに表示する場合はここで処理
    } finally {
      setIsLoading(false);
    }
  };

  const activeDescendantId = selectedIndex >= 0 ? `hs-option-${selectedIndex}` : undefined;
  const showSuggestions = suggestions.length > 0;

  return (
    <div className="space-y-6">
      {/* HSコード検索 */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">HSコード検索</h2>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSourceInfo(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="HSコードまたは商品名を入力..."
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls="hs-suggestions-listbox"
            aria-activedescendant={activeDescendantId}
            aria-label="HSコード検索"
            aria-autocomplete="list"
          />

          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="loading-spinner" aria-label="検索中"></div>
            </div>
          )}

          {/* 検索候補 */}
          {showSuggestions && (
            <div
              ref={listboxRef}
              id="hs-suggestions-listbox"
              role="listbox"
              aria-label="HSコード候補"
              className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {suggestions.map((item, index) => (
                <button
                  key={item.code}
                  id={`hs-option-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={index === selectedIndex}
                  onClick={() => handleHSCodeSelect(item)}
                  className={`w-full p-3 text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    index === selectedIndex
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-mono text-sm text-primary-600 dark:text-primary-400">{item.code}</div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 mt-1">{item.description_ja}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description_en}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedHSCode && (
          <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <div className="font-mono text-sm text-primary-700 dark:text-primary-400 font-semibold">{selectedHSCode.code}</div>
            <div className="text-sm text-gray-900 dark:text-gray-100 mt-1">{selectedHSCode.description_ja}</div>
            {(sourceInfo?.url || sourceInfo?.context) && (
              <div className="mt-3 pt-3 border-t border-primary-100 dark:border-primary-800">
                <div className="text-xs font-medium text-primary-800 dark:text-primary-300">
                  ページから取得
                </div>
                {sourceInfo.context && (
                  <p className="text-xs text-primary-700 dark:text-primary-300 mt-1 break-words">
                    {sourceInfo.context}
                  </p>
                )}
                {sourceInfo.url && (
                  <a
                    href={sourceInfo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-primary-700 dark:text-primary-300 mt-1 truncate underline"
                    title={sourceInfo.url}
                  >
                    {formatSourceUrl(sourceInfo.url)}
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">商品説明から検索語を作成</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Chrome内蔵AIで商品説明をHSコード検索用の短い語句へ整理します。
              </p>
            </div>
            <span className={`shrink-0 px-2 py-1 rounded-md text-[11px] font-medium ${getChromeAiStatusClassName()}`}>
              {getChromeAiStatusLabel()}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 p-3">
            <div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-200">Chrome内蔵AI</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Gemini Nanoを端末上で使います。初回はモデルの準備に時間がかかる場合があります。
              </p>
            </div>
            <button
              type="button"
              onClick={refreshChromeAiAvailability}
              className="shrink-0 px-2.5 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-primary-500"
              aria-label="Chrome内蔵AIの状態を再確認"
            >
              再確認
            </button>
          </div>

          {chromeAiDownloadProgress !== null && (
            <div className="mt-3" aria-label="Chrome内蔵AIモデルの準備状況">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>モデル準備中</span>
                <span>{chromeAiDownloadProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all"
                  style={{ width: `${Math.min(Math.max(chromeAiDownloadProgress, 0), 100)}%` }}
                />
              </div>
            </div>
          )}

          <textarea
            value={localLlmDescription}
            onChange={(e) => setLocalLlmDescription(e.target.value)}
            placeholder="例: アルミ製の自転車用ブレーキレバー。交換部品として販売。"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 mt-3 min-h-[88px] resize-y"
            aria-label="商品説明"
          />

          <button
            type="button"
            onClick={handleGenerateSearchKeywords}
            disabled={isGeneratingKeywords || localLlmDescription.trim().length < 2 || chromeAiAvailability === 'unavailable'}
            className="btn-secondary w-full mt-3 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Chrome内蔵AIで検索語を作成"
          >
            {isGeneratingKeywords ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                検索語を作成中...
              </div>
            ) : (
              'Chrome内蔵AIで検索語を作成'
            )}
          </button>

          {localLlmStatus && (
            <p
              className={`text-xs mt-2 ${
                localLlmStatus.type === 'success'
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {localLlmStatus.message}
            </p>
          )}

          {localLlmSuggestion && (
            <div className="mt-3 space-y-3">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">検索語</div>
                <div className="text-sm text-gray-900 dark:text-gray-100 mt-1 break-words">
                  {localLlmSuggestion.search_query}
                </div>
              </div>
              {renderKeywordChips('日本語', localLlmSuggestion.keywords_ja)}
              {renderKeywordChips('英語', localLlmSuggestion.keywords_en)}
              {renderKeywordChips('素材', localLlmSuggestion.materials)}
              {renderKeywordChips('用途', localLlmSuggestion.use_terms)}
              {renderKeywordChips('確認観点', localLlmSuggestion.notes)}
            </div>
          )}
        </div>
      </div>

      {/* 貿易条件設定 */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">貿易条件設定</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* 輸出国 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">輸出国</label>
            <select
              value={filters.from_country}
              onChange={(e) => setFilters({...filters, from_country: e.target.value})}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              aria-label="輸出国を選択"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>{country.name_ja}</option>
              ))}
            </select>
          </div>

          {/* 輸入国 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">輸入国</label>
            <select
              value={filters.to_country}
              onChange={(e) => setFilters({...filters, to_country: e.target.value})}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              aria-label="輸入国を選択"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>{country.name_ja}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 貿易金額 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            貿易金額（円）<span className="text-gray-500 dark:text-gray-400 text-xs ml-1">※削減額計算用</span>
          </label>
          <input
            type="number"
            value={filters.trade_value}
            onChange={handleTradeValueChange}
            placeholder="例: 1000000"
            className={`input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 ${errors.tradeValue ? 'border-red-500' : ''}`}
            min="0"
            aria-label="貿易金額"
          />
          {errors.tradeValue && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.tradeValue}</p>
          )}
        </div>
      </div>

      {/* 最適化実行ボタン */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <button
          onClick={handleOptimize}
          disabled={isLoading}
          className={`btn-primary w-full focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="関税最適化を実行"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="loading-spinner mr-2"></div>
              最適化を計算中...
            </div>
          ) : (
            '関税最適化を実行'
          )}
        </button>

        {errors.hsCode && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-2 text-center">
            {errors.hsCode}
          </p>
        )}
        {!selectedHSCode && !errors.hsCode && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            HSコードを選択してください
          </p>
        )}
      </div>

      {/* 使用方法のヒント */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">使用方法</h3>
        <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <p>1. 商品のHSコードを検索・選択</p>
          <p>2. 必要に応じて商品説明からChrome内蔵AIで検索語を作成</p>
          <p>3. 輸出国・輸入国を設定</p>
          <p>4. 貿易金額を入力（削減額計算用）</p>
          <p>5. 「関税最適化を実行」ボタンをクリック</p>
        </div>
      </div>
    </div>
  );
};

export default HSCodeSearch;
