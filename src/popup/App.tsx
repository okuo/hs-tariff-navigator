import React, { useState } from 'react';
import HSCodeSearch from '@/components/HSCodeSearch';
import TariffComparison from '@/components/TariffComparison';
import { OptimizationResult } from '@/types';

const App: React.FC = () => {
  const [selectedHSCode, setSelectedHSCode] = useState<string>('');
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [currentView, setCurrentView] = useState<'search' | 'results'>('search');

  const handleHSCodeSelect = (hsCode: string) => {
    setSelectedHSCode(hsCode);
  };

  const handleOptimizationResult = (result: OptimizationResult) => {
    setOptimizationResult(result);
    setCurrentView('results');
  };

  const handleBack = () => {
    setCurrentView('search');
    setOptimizationResult(null);
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {currentView === 'results' && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h1 className="text-lg font-bold text-gray-900">Trade Lens</h1>
            </div>
            <div className="text-xs text-gray-500">v1.0.0</div>
          </div>
          <p className="text-sm text-gray-600 mt-1">FTA/EPA最適化ツール</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="p-4">
        {currentView === 'search' ? (
          <HSCodeSearch
            onHSCodeSelect={handleHSCodeSelect}
            onOptimizationResult={handleOptimizationResult}
          />
        ) : (
          <TariffComparison
            result={optimizationResult}
            onBack={handleBack}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="border-t bg-white p-3 text-center">
        <p className="text-xs text-gray-500">
          ⚠️ この情報は参考値です。正確な関税率は税関等にご確認ください。
        </p>
      </footer>
    </div>
  );
};

export default App;