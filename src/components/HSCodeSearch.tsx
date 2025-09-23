import React, { useState, useEffect } from 'react';
import { HSCode, SearchFilters, OptimizationResult, CountryOption } from '@/types';
import { COUNTRIES } from '@/utils/constants';
import { searchHSCodes, optimizeTariff, saveSearchHistory } from '@/lib/api';

interface HSCodeSearchProps {
  onHSCodeSelect: (hsCode: string) => void;
  onOptimizationResult: (result: OptimizationResult) => void;
}

const HSCodeSearch: React.FC<HSCodeSearchProps> = ({ onHSCodeSelect, onOptimizationResult }) => {
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
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

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
    onHSCodeSelect(hsCode.code);
  };

  // 最適化実行
  const handleOptimize = async () => {
    if (!selectedHSCode || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await optimizeTariff(
        selectedHSCode.code,
        filters.from_country,
        filters.to_country,
        filters.trade_value
      );
      
      // 検索履歴を保存
      try {
        await saveSearchHistory(
          selectedHSCode.code,
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

  return (
    <div className="space-y-6">
      {/* HSコード検索 */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">HSコード検索</h2>
        
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="HSコードまたは商品名を入力..."
            className="input-field"
          />
          
          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          {/* 検索候補 */}
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <button
                  key={item.code}
                  onClick={() => handleHSCodeSelect(item)}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-mono text-sm text-primary-600">{item.code}</div>
                  <div className="text-sm text-gray-900 mt-1">{item.description_ja}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.description_en}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedHSCode && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <div className="font-mono text-sm text-primary-700 font-semibold">{selectedHSCode.code}</div>
            <div className="text-sm text-gray-900 mt-1">{selectedHSCode.description_ja}</div>
          </div>
        )}
      </div>

      {/* 貿易条件設定 */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">貿易条件設定</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* 輸出国 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">輸出国</label>
            <select
              value={filters.from_country}
              onChange={(e) => setFilters({...filters, from_country: e.target.value})}
              className="input-field"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>{country.name_ja}</option>
              ))}
            </select>
          </div>

          {/* 輸入国 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">輸入国</label>
            <select
              value={filters.to_country}
              onChange={(e) => setFilters({...filters, to_country: e.target.value})}
              className="input-field"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>{country.name_ja}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 貿易金額 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            貿易金額（円）<span className="text-gray-500 text-xs ml-1">※削減額計算用</span>
          </label>
          <input
            type="number"
            value={filters.trade_value}
            onChange={(e) => setFilters({...filters, trade_value: Number(e.target.value)})}
            placeholder="例: 1000000"
            className="input-field"
            min="0"
          />
        </div>
      </div>

      {/* 最適化実行ボタン */}
      <div className="card">
        <button
          onClick={handleOptimize}
          disabled={!selectedHSCode || isLoading}
          className={`btn-primary w-full ${
            (!selectedHSCode || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
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
        
        {!selectedHSCode && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            HSコードを選択してください
          </p>
        )}
      </div>

      {/* 使用方法のヒント */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 使用方法</h3>
        <div className="text-sm text-blue-700 space-y-1">
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