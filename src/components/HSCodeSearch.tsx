import React, { useState, useEffect, useRef } from 'react';
import { HSCode, SearchFilters, OptimizationResult } from '@/types';
import { COUNTRIES } from '@/utils/constants';
import { searchHSCodes, optimizeTariff, saveSearchHistory } from '@/lib/api';

interface PrefilledData {
  hsCode: string;
  fromCountry: string;
  toCountry: string;
  tradeValue: number;
}

interface HSCodeSearchProps {
  onHSCodeSelect: (hsCode: string) => void;
  onOptimizationResult: (result: OptimizationResult) => void;
  prefilledData?: PrefilledData | null;
  onPrefilledDataUsed?: () => void;
}

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
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [errors, setErrors] = useState<{ tradeValue?: string; hsCode?: string }>({});
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listboxRef = useRef<HTMLDivElement>(null);

  // 履歴から選択された場合、データを復元
  useEffect(() => {
    if (prefilledData) {
      setSearchTerm(prefilledData.hsCode);
      setSelectedHSCode({
        code: prefilledData.hsCode,
        description_ja: '',
        description_en: '',
        unit: '',
        created_at: '',
        updated_at: ''
      });
      setFilters({
        from_country: prefilledData.fromCountry,
        to_country: prefilledData.toCountry,
        trade_value: prefilledData.tradeValue || 0
      });
      onHSCodeSelect(prefilledData.hsCode);
      if (onPrefilledDataUsed) {
        onPrefilledDataUsed();
      }
    }
  }, [prefilledData, onHSCodeSelect, onPrefilledDataUsed]);

  // 検索処理（デバウンス付き）
  useEffect(() => {
    // 既存のタイマーをクリア
    if (searchTimer) {
      clearTimeout(searchTimer);
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
      
      setSearchTimer(timer);
    } else {
      setSuggestions([]);
      setSelectedIndex(-1);
      setIsSearching(false);
    }
    
    // クリーンアップ
    return () => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
    };
  }, [searchTerm]);

  const handleHSCodeSelect = (hsCode: HSCode) => {
    setSelectedHSCode(hsCode);
    setSearchTerm(hsCode.code);
    setSuggestions([]);
    setSelectedIndex(-1);
    onHSCodeSelect(hsCode.code);
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
          </div>
        )}
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
          <p>2. 輸出国・輸入国を設定</p>
          <p>3. 貿易金額を入力（削減額計算用）</p>
          <p>4. 「関税最適化を実行」ボタンをクリック</p>
        </div>
      </div>
    </div>
  );
};

export default HSCodeSearch;