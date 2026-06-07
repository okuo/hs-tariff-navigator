import React, { useState, useRef, useEffect } from 'react';
import type { DataReference, OptimizationResult } from '@/types';
import { ToastType } from '@/hooks/useToast';
import { COUNTRIES } from '@/utils/constants';
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

  const escapeCsvField = (value: string | number | undefined): string => {
    const text = value == null ? '' : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const buildCsvContent = (data: OptimizationResult): string => {
    const calculateDutyAmountForCsv = (rate: number) => Math.round((data.trade_value * rate) / 100);
    const baseDutyAmountForCsv = calculateDutyAmountForCsv(data.base_rate);
    const headers = [
      '協定名',
      '協定名(英)',
      '税率区分',
      '関税率(%)',
      '基本税額(円)',
      '協定適用後税額(円)',
      '削減額(円)',
      '削減率(%)',
      '出典',
      '検証日',
      '適用開始',
      '適用終了',
      '備考',
    ];
    const rows = data.agreements.map((item) => [
      item.agreement.name_ja,
      item.agreement.name_en,
      getRateSourceLabel(item.rate_source),
      item.rate.toFixed(1),
      baseDutyAmountForCsv.toString(),
      calculateDutyAmountForCsv(item.rate).toString(),
      item.savings_amount.toString(),
      item.savings_percentage.toFixed(1),
      getReferenceSourceLabel(item.reference),
      item.reference?.last_verified_at ?? '',
      item.reference?.effective_from ?? '',
      item.reference?.effective_to ?? '',
      item.reference?.source_note ?? item.data_note ?? '',
    ]);

    const bom = '\uFEFF';
    const csvLines = [
      ['HSコード', data.hs_code],
      ['輸出国', data.from_country],
      ['輸入国', data.to_country],
      ['貿易額', data.trade_value],
      ['基本関税率(MFN)', `${data.base_rate.toFixed(1)}%`],
      ['基本関税率区分', getBaseRateSourceLabel(data.base_rate_source)],
      ['基本関税率出典', getReferenceSourceLabel(data.base_rate_reference)],
      ['基本関税率検証日', data.base_rate_reference?.last_verified_at ?? ''],
      ['データ出典', getReferenceSourceLabel(data.data_reference)],
      ['データ適用範囲', formatReferenceRange(data.data_reference)],
      '',
      headers,
      ...rows,
      '',
      ...(data.data_warnings?.map((warning) => ['注意', warning]) ?? []),
    ].map((line) => Array.isArray(line) ? line.map(escapeCsvField).join(',') : line);
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
      const calculateDutyAmountForCopy = (rate: number) => Math.round((result.trade_value * rate) / 100);
      const baseDutyAmountForCopy = calculateDutyAmountForCopy(result.base_rate);
      const lines = [
        `[TariffScope] 関税最適化結果`,
        `HSコード: ${result.hs_code}`,
        `輸出国: ${result.from_country} / 輸入国: ${result.to_country}`,
        `貿易額: ${result.trade_value.toLocaleString()}円`,
        `基本関税率(MFN): ${result.base_rate.toFixed(1)}%`,
        `基本関税率出典: ${getReferenceSourceLabel(result.base_rate_reference)}`,
        `データ適用範囲: ${formatReferenceRange(result.data_reference)}`,
        `基本税額: ${baseDutyAmountForCopy.toLocaleString()}円`,
        '',
        '--- 協定別比較 ---',
        ...result.agreements.map(
          (item) =>
            `${item.agreement.name_ja}: ${item.rate.toFixed(1)}% [${getRateSourceLabel(item.rate_source)} / ${getReferenceSourceLabel(item.reference)} / ${formatReferenceRange(item.reference)}] (協定適用後税額: ${calculateDutyAmountForCopy(item.rate).toLocaleString()}円, 削減額: ${item.savings_amount.toLocaleString()}円, 削減率: ${item.savings_percentage.toFixed(1)}%)`
        ),
      ];
      if (result.best_agreement) {
        lines.push('', `${result.best_agreement.rate_source === 'estimated' ? '参考候補' : '推奨'}: ${result.best_agreement.agreement.name_ja}`);
      }
      if (result.data_warnings?.length) {
        lines.push('', '--- 注意 ---', ...result.data_warnings);
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

  const formatDate = (value?: string) => {
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

  const formatReferenceRange = (reference?: DataReference) => {
    if (!reference?.effective_from && !reference?.effective_to) {
      return '不明';
    }

    return `${formatDate(reference.effective_from)} - ${
      reference.effective_to ? formatDate(reference.effective_to) : '継続中'
    }`;
  };

  const getReferenceSourceLabel = (reference?: DataReference) => {
    return reference?.source_name ?? '出典未設定';
  };

  const getRateSourceLabel = (source?: string) => {
    return source === 'estimated' ? '参考推定' : '収録データ';
  };

  const getBaseRateSourceLabel = (source?: string) => {
    switch (source) {
      case 'fallback_hs':
        return '同一HSコード参考値';
      case 'default':
        return '標準参考値';
      default:
        return '収録データ';
    }
  };

  const calculateDutyAmount = (rate: number) => {
    return Math.round((result.trade_value * rate) / 100);
  };

  const getCountryName = (code: string) => {
    return COUNTRIES.find((country) => country.code === code)?.name_ja ?? code;
  };

  const baseDutyAmount = calculateDutyAmount(result.base_rate);
  const bestDutyAmount = result.best_agreement
    ? calculateDutyAmount(result.best_agreement.rate)
    : 0;
  const isBestEstimated = result.best_agreement?.rate_source === 'estimated';

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
          <div className={`${isBestEstimated ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' : 'bg-success-50 dark:bg-green-900/30 border-success-200 dark:border-green-800'} border rounded-lg p-4 mb-4`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 mt-0.5 ${isBestEstimated ? 'text-amber-500' : 'text-success-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  {isBestEstimated ? (
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  )}
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-sm font-semibold ${isBestEstimated ? 'text-amber-800 dark:text-amber-300' : 'text-success-800 dark:text-green-300'}`}>
                  {isBestEstimated ? '参考候補を表示しています' : '最適協定が見つかりました'}
                </h3>
                <p className={`text-sm mt-1 ${isBestEstimated ? 'text-amber-700 dark:text-amber-300' : 'text-success-700 dark:text-green-400'}`}>
                  {result.best_agreement.agreement.name_ja}
                </p>
                <div className={`mt-2 text-sm ${isBestEstimated ? 'text-amber-800 dark:text-amber-300' : 'text-success-800 dark:text-green-300'}`}>
                  <span className="font-semibold">削減額: </span>
                  {formatCurrency(result.best_agreement.savings_amount)}
                  <span className="ml-2">({formatPercentage(result.best_agreement.savings_percentage)}削減)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 計算条件 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">貿易条件</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
              {getCountryName(result.from_country)} → {getCountryName(result.to_country)}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">計算対象額</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
              {formatCurrency(result.trade_value)}
            </div>
          </div>
        </div>

        {/* 基本関税率 */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">基本関税率（MFN）</span>
            <div className="text-right">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatPercentage(result.base_rate)}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getBaseRateSourceLabel(result.base_rate_source)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getReferenceSourceLabel(result.base_rate_reference)}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>基本税額</span>
            <span>{formatCurrency(baseDutyAmount)}</span>
          </div>
        </div>

        {result.data_reference && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">データ出典</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                  {result.data_reference.source_url ? (
                    <a
                      href={result.data_reference.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {getReferenceSourceLabel(result.data_reference)}
                    </a>
                  ) : (
                    getReferenceSourceLabel(result.data_reference)
                  )}
                </div>
              </div>
              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                <div>検証日: {formatDate(result.data_reference.last_verified_at)}</div>
                <div>適用範囲: {formatReferenceRange(result.data_reference)}</div>
              </div>
            </div>
          </div>
        )}

        {result.best_agreement && (
          <div className="border border-primary-100 dark:border-primary-900/50 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-primary-800 dark:text-primary-300">
              {isBestEstimated ? '参考候補の理由' : '推奨理由'}
            </h3>
            <p className="text-xs text-primary-700 dark:text-primary-300 mt-1 leading-relaxed">
              {result.best_agreement.agreement.name_ja}を適用すると、関税率が
              {formatPercentage(result.base_rate)}から{formatPercentage(result.best_agreement.rate)}になり、
              税額は{formatCurrency(baseDutyAmount)}から{formatCurrency(bestDutyAmount)}に下がります。
              {isBestEstimated && ' この税率は未収録データに基づく参考推定です。'}
            </p>
          </div>
        )}

        {result.data_warnings && result.data_warnings.length > 0 && (
          <div className="mt-3 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">データに関する注意</p>
            <ul className="mt-1 space-y-1">
              {result.data_warnings.map((warning) => (
                <li key={warning} className="text-xs text-amber-700 dark:text-amber-300">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 協定別比較 */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">協定別関税率比較</h3>

        <div className="space-y-3">
          {result.agreements.map((item) => {
            const agreementDutyAmount = calculateDutyAmount(item.rate);

            return (
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
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      item.rate_source === 'estimated'
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {getRateSourceLabel(item.rate_source)}
                    </span>
                    {result.best_agreement?.agreement.id === item.agreement.id && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 dark:bg-green-900/50 text-success-800 dark:text-green-300">
                        {item.rate_source === 'estimated' ? '参考候補' : '推奨'}
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

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">計算根拠</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400">基本税額</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">
                      {formatCurrency(baseDutyAmount)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400">協定適用後</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mt-0.5">
                      {formatCurrency(agreementDutyAmount)}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {formatCurrency(result.trade_value)} × ({formatPercentage(result.base_rate)} - {formatPercentage(item.rate)}) = {formatCurrency(item.savings_amount)}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400">出典</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                      {item.reference?.source_url ? (
                        <a
                          href={item.reference.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {getReferenceSourceLabel(item.reference)}
                        </a>
                      ) : (
                        getReferenceSourceLabel(item.reference)
                      )}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400">適用期間</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                      {formatReferenceRange(item.reference)}
                    </div>
                  </div>
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
              {item.data_note && (
                <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
                  {item.data_note}
                </p>
              )}
            </div>
            );
          })}
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
