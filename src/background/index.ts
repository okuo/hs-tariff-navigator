// Service Worker for Chrome Extension
import { STORAGE_KEYS } from '@/utils/constants';

// Extension のインストール時
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Trade Lens extension installed:', details);
  
  // 初期設定（エラーハンドリング付き）
  chrome.storage.local.set({
    [STORAGE_KEYS.USER_SETTINGS]: {
      defaultFromCountry: 'JP',
      defaultToCountry: 'CN',
      language: 'ja'
    },
    [STORAGE_KEYS.SEARCH_HISTORY]: []
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error setting initial data:', chrome.runtime.lastError);
    } else {
      console.log('Initial data set successfully');
    }
  });
});

// アクションクリック時（ポップアップ表示）
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked:', tab);
});

// メッセージリスナー（Content Script との通信）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  
  try {
    switch (message.type) {
      case 'GET_CURRENT_URL':
        if (sender.tab) {
          sendResponse({ url: sender.tab.url });
        } else {
          sendResponse({ error: 'No tab information available' });
        }
        break;
        
      case 'SAVE_SEARCH_HISTORY':
        saveSearchHistory(message.data).then(() => {
          sendResponse({ success: true });
        }).catch((error) => {
          console.error('Save search history error:', error);
          sendResponse({ success: false, error: error.message });
        });
        return true; // 非同期応答のため

      case 'GET_SEARCH_HISTORY':
        getSearchHistory().then((history) => {
          sendResponse({ history });
        }).catch((error) => {
          console.error('Get search history error:', error);
          sendResponse({ error: error.message });
        });
        return true;

      default:
        sendResponse({ error: 'Unknown message type' });
    }
  } catch (error) {
    console.error('Message handler error:', error);
    sendResponse({ error: 'Internal error in message handler' });
  }
});

// 検索履歴の保存
async function saveSearchHistory(searchData: any) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.SEARCH_HISTORY]);
    const history = result[STORAGE_KEYS.SEARCH_HISTORY] || [];
    
    // 新しい検索を履歴の先頭に追加
    const newSearch = {
      id: Date.now().toString(),
      ...searchData,
      timestamp: new Date().toISOString()
    };
    
    // 最大50件まで保持
    const updatedHistory = [newSearch, ...history].slice(0, 50);
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.SEARCH_HISTORY]: updatedHistory
    });
    
    console.log('Search history saved:', newSearch);
  } catch (error) {
    console.error('Error saving search history:', error);
    throw error;
  }
}

// 検索履歴の取得
async function getSearchHistory() {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.SEARCH_HISTORY]);
    return result[STORAGE_KEYS.SEARCH_HISTORY] || [];
  } catch (error) {
    console.error('Error getting search history:', error);
    throw error;
  }
}

// Chrome API の安全な初期化
function safeInitializeChromeAPIs() {
  // Chrome API存在チェック
  if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
    console.warn('Chrome Extension context not available');
    return false;
  }

  console.log('Initializing Chrome APIs safely...');

  // Service Workerの場合、すべてのAPIが利用可能ではない
  if (typeof (globalThis as any).importScripts === 'function') {
    console.log('Running in Service Worker context - some APIs may be limited');
  }

  // アラーム機能の初期化（オプショナル）
  try {
    if (chrome.alarms) {
      chrome.alarms.create('dataUpdate', {
        delayInMinutes: 60 * 24,
        periodInMinutes: 60 * 24
      });
      
      // アラームリスナー
      chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'dataUpdate') {
          console.log('Checking for data updates...');
        }
      });
      
      console.log('Alarms API initialized');
    }
  } catch (error) {
    console.warn('Alarms API not available or failed to initialize:', error);
  }

  // タブ監視機能の初期化（オプショナル）
  try {
    if (chrome.tabs && chrome.tabs.onUpdated && chrome.tabs.onUpdated.addListener) {
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.url) {
          console.log('Tab updated:', tab.url);
        }
      });
      console.log('Tab listeners initialized');
    }
  } catch (error) {
    console.warn('Tabs API not available or failed to initialize:', error);
  }

  return true;
}

// Service Worker 起動時に基本的な初期化のみ実行
console.log('Trade Lens background script loaded');

// Chrome拡張機能用エラーハンドリング
// Service Workerの標準的なエラーハンドリングは不要
// Chrome APIでエラーが発生した場合は、各API呼び出しで個別に処理

export {};