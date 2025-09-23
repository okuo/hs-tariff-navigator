import React from 'react';
import { OptimizationResult } from '@/types';

interface TariffComparisonProps {
  result: OptimizationResult | null;
  onBack: () => void;
}

const TariffComparison: React.FC<TariffComparisonProps> = ({ result, onBack }) => {
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
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最適化結果</h2>
          <span className="font-mono text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded">
            {result.hs_code}
          </span>
        </div>

        {result.best_agreement && (
          <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-success-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-semibold text-success-800">
                  最適協定が見つかりました！
                </h3>
                <p className="text-sm text-success-700 mt-1">
                  {result.best_agreement.agreement.name_ja}
                </p>
                <div className="mt-2 text-sm text-success-800">
                  <span className="font-semibold">削減額: </span>
                  {formatCurrency(result.best_agreement.savings_amount)}
                  <span className="ml-2">({formatPercentage(result.best_agreement.savings_percentage)}削減)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 基本関税率 */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">基本関税率（MFN）</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatPercentage(result.base_rate)}
            </span>
          </div>
        </div>
      </div>

      {/* 協定別比較 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">協定別関税率比較</h3>
        
        <div className="space-y-3">
          {result.agreements.map((item, index) => (
            <div
              key={item.agreement.id}
              className={`border rounded-lg p-4 ${
                result.best_agreement?.agreement.id === item.agreement.id
                  ? 'border-success-300 bg-success-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">
                      {item.agreement.name_ja}
                    </h4>
                    {result.best_agreement?.agreement.id === item.agreement.id && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800">
                        推奨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.agreement.name_en}
                  </p>
                  
                  {/* 削減効果 */}
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">関税率:</span>
                      <span className="font-semibold text-gray-900">
                        {formatPercentage(item.rate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600">削減額:</span>
                      <span className="font-semibold text-success-600">
                        {formatCurrency(item.savings_amount)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    -{formatPercentage(item.savings_percentage)}
                  </div>
                  <div className="text-xs text-gray-500">削減率</div>
                </div>
              </div>

              {/* 条件情報 */}
              {item.conditions && Object.keys(item.conditions).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">適用条件:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
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

      {/* 原産地規則情報 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">原産地規則について</h3>
        
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex">
            <svg className="flex-shrink-0 h-5 w-5 text-warning-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-warning-800">
                協定税率の適用には原産地証明が必要です
              </h4>
              <div className="mt-2 text-sm text-warning-700">
                <p>• 原産地証明書（CO）または自己申告による原産地証明</p>
                <p>• 協定別の原産地規則に適合していることが条件</p>
                <p>• 詳細は税関または通関業者にご相談ください</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="space-y-3">
        <button
          onClick={() => {
            // データエクスポート機能（Phase 2で実装）
            console.log('Export data:', result);
          }}
          className="btn-secondary w-full"
        >
          結果をエクスポート（準備中）
        </button>
        
        <button
          onClick={onBack}
          className="btn-primary w-full"
        >
          新しい検索を開始
        </button>
      </div>
    </div>
  );
};

export default TariffComparison;