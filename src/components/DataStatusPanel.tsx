import React, { useCallback, useEffect, useState } from 'react';
import { DataStatus } from '@/types';
import { getDataStatus, refreshData } from '@/lib/api';

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '不明';
  }

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const DataStatusPanel: React.FC = () => {
  const [status, setStatus] = useState<DataStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      setError(null);
      const nextStatus = await getDataStatus();
      setStatus(nextStatus);
    } catch {
      setError('データ情報を取得できませんでした');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setError(null);
    try {
      await refreshData();
      await loadStatus();
    } catch {
      setError('データ更新に失敗しました');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="card dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">データ情報</h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-primary-500 ${
            isRefreshing || isLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          aria-label="データを更新"
        >
          <svg
            className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0119 5m0 0h-5m5 0v5" />
          </svg>
          {isRefreshing ? '更新中' : '更新'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="loading-spinner mr-2" aria-label="データ情報を読み込み中"></div>
          読み込み中...
        </div>
      ) : error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : status ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">データ版</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                v{status.version}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">最終取得</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                {formatDateTime(status.cached_at)}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">データ更新日</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
              {formatDateTime(status.data_updated_at)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-2">
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {status.counts.hs_codes.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">HS</div>
            </div>
            <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-2">
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {status.counts.agreements.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">協定</div>
            </div>
            <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-2">
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {status.counts.tariff_rates.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">税率</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DataStatusPanel;
