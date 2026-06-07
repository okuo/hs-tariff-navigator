import React, { useCallback, useEffect, useState } from 'react';
import { DataStatus } from '@/types';
import { getDataStatus, refreshData } from '@/lib/api';

const formatDateTime = (value?: string): string => {
  if (!value) {
    return '不明';
  }

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

const formatDate = (value?: string): string => {
  if (!value) {
    return '不明';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '不明';
  }

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const formatEffectiveRange = (from?: string, to?: string): string => {
  if (!from && !to) {
    return '不明';
  }

  return `${formatDate(from)} - ${to ? formatDate(to) : '継続中'}`;
};

const DataStatusPanel: React.FC = () => {
  const [status, setStatus] = useState<DataStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
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

  const handleReload = async () => {
    if (isReloading) return;

    setIsReloading(true);
    setError(null);
    try {
      await refreshData();
      await loadStatus();
    } catch {
      setError('同梱データの再読み込みに失敗しました');
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="card dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">収録データ</h2>
          <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {status?.source === 'remote' ? 'オンライン更新データ' : '同梱データ'}
          </div>
        </div>
        <button
          type="button"
          onClick={handleReload}
          disabled={isReloading || isLoading}
          className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-primary-500 ${
            isReloading || isLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          aria-label="同梱データを再読み込み"
        >
          <svg
            className={`w-3.5 h-3.5 mr-1.5 ${isReloading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0119 5m0 0h-5m5 0v5" />
          </svg>
          {isReloading ? '読込中' : '再読み込み'}
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
              <div className="text-xs text-gray-500 dark:text-gray-400">アプリ読込</div>
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

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">データ出典</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
              {status.source_url ? (
                <a
                  href={status.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {status.source_name}
                </a>
              ) : (
                status.source_name
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>
                <span className="text-gray-500 dark:text-gray-400">検証日</span>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(status.last_verified_at)}
                </div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">適用範囲</span>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {formatEffectiveRange(status.effective_from, status.effective_to)}
                </div>
              </div>
            </div>
            {status.source_note && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                {status.source_note}
              </p>
            )}
          </div>

          {!status.remote_updates_enabled && (
            <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
              <div className="text-xs font-medium text-amber-800 dark:text-amber-300">
                オンライン更新元は未設定です
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                表示中の税率・協定情報は拡張機能に同梱された参考データです。
              </p>
            </div>
          )}

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
