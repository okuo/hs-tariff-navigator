import React, { useState, useRef, useEffect } from 'react';
import { OptimizationResult } from '@/types';
import { ToastType } from '@/hooks/useToast';
import OriginRulesGuide from './OriginRulesGuide';

interface TariffComparisonProps {
  result: OptimizationResult | null;
  onBack: () => void;
  onToast?: (type: ToastType, message: string) => void;
}

const TariffComparison: React.FC<TariffComparisonProps> = ({ result, onBack, onToast }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buildCsvContent = (data: OptimizationResult): string => {
    const headers = ['協定名', '協定名(英)', '関税率(%)', '削減額(円)', '削減率(%)'];
    const rows = data.agreements.map((item) => [
      item.agreement.name_ja,
      item.agreement.name_en,
      item.rate.toFixed(1),
      item.savings_amount.toString(),
      item.savings_percentage.toFixed(1),
    ]);

    const bom = '\uFEFF';
    const csvLines = [
      `HSコード,${data.hs_code}`,
      `輸出国,${data.from_country}`,
      `輸入国,${data.to_country}`,
      `貿易額,${data.trade_value}`,
      `基本関税率(MFN),${data.base_rate.toFixed(1)}%`,
      '',
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ];
    return bom + csvLines.join('\n');
  };

  const handleExportCsv = () => {
    if (!result) return;
    try {
      const csv = buildCsvContent(result);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tariff_${result.hs_code}_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setShowExportMenu(false);
      onToast?.('success', 'CSVファイルをダウンロードしました');
    } catch {
      onToast?.('error', 'CSVエクスポートに失敗しました');
    }
  };

  const handleCopyClipboard = async () => {
    if (!result) return;
    try {
      const lines = [
        `[TariffScope] 関税最適化結果`,
        `HSコード: ${result.hs_code}`,
        `輸出国: ${result.from_country} / 輸入国: ${result.to_country}`,
        `貿易額: ${result.trade_value.toLocaleString()}円`,
        `基本関税率(MFN): ${result.base_rate.toFixed(1)}%`,
        '',
        '--- 協定別比較 ---',
        ...result.agreements.map(
          (item) =>
            `${item.agreement.name_ja}: ${item.rate.toFixed(1)}% (削減額: ${item.savings_amount.toLocaleString()}円, 削減率: ${item.savings_percentage.toFixed(1)}%)`
        ),
      ];
      if (result.best_agreement) {
        lines.push('', `推奨: ${result.best_agreement.agreement.name_ja}`);
      }
      await navigator.clipboard.writeText(lines.join('\n'));
      setShowExportMenu(false);
      onToast?.('success', 'クリップボードにコピーしました');
    } catch {
      onToast?.('error', 'クリップボードへのコピーに失敗しました');
    }
  };
  if (!result) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">結果がありません</p>
        <button onClick={onBack} className="btn-secondary mt-4">
          戻る
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* 結果サマリー */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">最適化結果</h2>
          <span className="font-mono text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
            {result.hs_code}
          </span>
        </div>

        {result.best_agreement && (
          <div className="bg-success-50 dark:bg-green-900/30 border border-success-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-success-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-semibold text-success-800 dark:text-green-300">
                  最適協定が見つかりました！
                </h3>
                <p className="text-sm text-success-700 dark:text-green-400 mt-1">
                  {result.best_agreement.agreement.name_ja}
                </p>
                <div className="mt-2 text-sm text-success-800 dark:text-green-300">
                  <span className="font-semibold">削減額: </span>
                  {formatCurrency(result.best_agreement.savings_amount)}
                  <span className="ml-2">({formatPercentage(result.best_agreement.savings_percentage)}削減)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 基本関税率 */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">基本関税率（MFN）</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatPercentage(result.base_rate)}
            </span>
          </div>
        </div>
      </div>

      {/* 協定別比較 */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">協定別関税率比較</h3>

        <div className="space-y-3">
          {result.agreements.map((item) => (
            <div
              key={item.agreement.id}
              className={`border rounded-lg p-4 ${
                result.best_agreement?.agreement.id === item.agreement.id
                  ? 'border-success-300 dark:border-green-700 bg-success-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {item.agreement.name_ja}
                    </h4>
                    {result.best_agreement?.agreement.id === item.agreement.id && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 dark:bg-green-900/50 text-success-800 dark:text-green-300">
                        推奨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.agreement.name_en}
                  </p>

                  {/* 削減効果 */}
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">関税率:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatPercentage(item.rate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600 dark:text-gray-400">削減額:</span>
                      <span className="font-semibold text-success-600">
                        {formatCurrency(item.savings_amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    -{formatPercentage(item.savings_percentage)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">削減率</div>
                </div>
              </div>

              {/* 条件情報 */}
              {item.conditions && Object.keys(item.conditions).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">適用条件:</p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    {Object.entries(item.conditions).map(([key, value]: [string, any]) => (
                      <li key={key}>• {key}: {String(value)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 原産地規則ガイド */}
      {result.best_agreement && (
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <OriginRulesGuide
            agreementId={result.best_agreement.agreement.id}
            agreementName={result.best_agreement.agreement.name_ja}
          />
        </div>
      )}

      {/* アクションボタン */}
      <div className="space-y-3">
        <div className="relative" ref={exportMenuRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="btn-secondary w-full flex items-center justify-center focus:ring-2 focus:ring-primary-500"
            aria-label="結果をエクスポート"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            結果をエクスポート
          </button>

          {showExportMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-10">
              <button
                onClick={handleExportCsv}
                className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 flex items-center"
                aria-label="CSVファイルとしてダウンロード"
              >
                <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSVファイルとしてダウンロード
              </button>
              <button
                onClick={handleCopyClipboard}
                className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 border-t border-gray-100 dark:border-gray-700 flex items-center"
                aria-label="クリップボードにコピー"
              >
                <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                クリップボードにコピー
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          className="btn-primary w-full focus:ring-2 focus:ring-primary-500"
          aria-label="新しい検索を開始"
        >
          新しい検索を開始
        </button>
      </div>
    </div>
  );
};

export default TariffComparison;