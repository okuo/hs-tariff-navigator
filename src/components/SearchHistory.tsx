import React, { useState, useEffect } from 'react';
import { getSearchHistory, clearSearchHistory } from '@/lib/api';
import { COUNTRIES } from '@/utils/constants';

interface HistoryItem {
  id: string;
  hs_code: string;
  from_country: string;
  to_country: string;
  trade_value: number | null;
  best_agreement_name?: string;
  savings_amount?: number;
  timestamp: string;
}

interface SearchHistoryProps {
  onSelectHistory: (hsCode: string, fromCountry: string, toCountry: string, tradeValue: number) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelectHistory }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getSearchHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load search history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('検索履歴をすべて削除しますか？')) {
      try {
        await clearSearchHistory();
        setHistory([]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  const getCountryName = (code: string): string => {
    const country = COUNTRIES.find(c => c.code === code);
    return country ? country.name_ja : code;
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? 'たった今' : `${minutes}分前`;
      }
      return `${hours}時間前`;
    } else if (days === 1) {
      return '昨日';
    } else if (days < 7) {
      return `${days}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400">検索履歴がありません</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">HSコードを検索すると履歴が表示されます</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">検索履歴</h2>
        <button
          onClick={handleClearHistory}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:ring-2 focus:ring-primary-500"
          aria-label="検索履歴をすべて削除"
        >
          すべて削除
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectHistory(
              item.hs_code,
              item.from_country,
              item.to_country,
              item.trade_value || 0
            )}
            className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all focus:ring-2 focus:ring-primary-500"
            aria-label={`HSコード ${item.hs_code} の検索結果を復元`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">
                    {item.hs_code}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                  <span>{getCountryName(item.from_country)}</span>
                  <svg className="w-4 h-4 mx-1 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span>{getCountryName(item.to_country)}</span>
                </div>

                {item.best_agreement_name && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    最適協定: {item.best_agreement_name}
                  </div>
                )}
              </div>

              <div className="text-right">
                {item.savings_amount && item.savings_amount > 0 && (
                  <div className="text-sm font-medium text-success-600">
                    {formatCurrency(item.savings_amount)}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">削減</span>
                  </div>
                )}
                {item.trade_value && item.trade_value > 0 && (
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {formatCurrency(item.trade_value)}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          直近{history.length}件の検索履歴を表示
        </p>
      </div>
    </div>
  );
};

export default SearchHistory;
