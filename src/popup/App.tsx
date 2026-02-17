import React, { useState, useCallback, useEffect } from 'react';
import HSCodeSearch from '@/components/HSCodeSearch';
import TariffComparison from '@/components/TariffComparison';
import SearchHistory from '@/components/SearchHistory';
import ToastContainer from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { OptimizationResult } from '@/types';

type TabType = 'search' | 'history';
type ViewType = 'main' | 'results';

const App: React.FC = () => {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [darkMode, setDarkMode] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  // ダークモード初期化: chrome.storage.local から読み込み、なければシステム設定を使用
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get('darkMode', (result) => {
        if (result.darkMode !== undefined) {
          setDarkMode(result.darkMode);
        } else {
          setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
      });
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // ダークモード変更時にclass適用 + storage保存
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ darkMode });
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 履歴から検索を復元するためのstate
  const [prefilledData, setPrefilledData] = useState<{
    hsCode: string;
    fromCountry: string;
    toCountry: string;
    tradeValue: number;
  } | null>(null);

  const handleHSCodeSelect = useCallback((_hsCode: string) => {
    // HSコード選択時のコールバック（将来の拡張用）
  }, []);

  const handleOptimizationResult = (result: OptimizationResult) => {
    setOptimizationResult(result);
    setCurrentView('results');
  };

  const handleBack = () => {
    setCurrentView('main');
    setOptimizationResult(null);
  };

  const handleHistorySelect = (hsCode: string, fromCountry: string, toCountry: string, tradeValue: number) => {
    setPrefilledData({ hsCode, fromCountry, toCountry, tradeValue });
    setActiveTab('search');
  };

  // prefilledDataがセットされたらリセット（HSCodeSearchで使用後）
  const clearPrefilledData = useCallback(() => {
    setPrefilledData(null);
  }, []);

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {currentView === 'results' && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus:ring-2 focus:ring-primary-500"
                  aria-label="戻る"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">TariffScope</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-primary-500"
                aria-label={darkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
              >
                {darkMode ? (
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <div className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">FTA/EPA最適化ツール</p>
        </div>

        {/* タブナビゲーション（メイン画面のみ表示） */}
        {currentView === 'main' && (
          <div className="flex border-t dark:border-gray-700">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 ${
                activeTab === 'search'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label="検索タブ"
            >
              <div className="flex items-center justify-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>検索</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-primary-500 ${
                activeTab === 'history'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label="履歴タブ"
            >
              <div className="flex items-center justify-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>履歴</span>
              </div>
            </button>
          </div>
        )}
      </header>

      {/* メインコンテンツ */}
      <main className="p-4">
        {currentView === 'results' ? (
          <TariffComparison
            result={optimizationResult}
            onBack={handleBack}
            onToast={addToast}
          />
        ) : (
          <>
            {activeTab === 'search' ? (
              <HSCodeSearch
                onHSCodeSelect={handleHSCodeSelect}
                onOptimizationResult={handleOptimizationResult}
                prefilledData={prefilledData}
                onPrefilledDataUsed={clearPrefilledData}
              />
            ) : (
              <SearchHistory onSelectHistory={handleHistorySelect} />
            )}
          </>
        )}
      </main>

      {/* フッター */}
      <footer className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ※この情報は参考値です。正確な関税率は税関等にご確認ください。
        </p>
      </footer>
    </div>
  );
};

export default App;
