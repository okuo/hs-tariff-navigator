// Service Worker for Chrome Extension
import { STORAGE_KEYS } from '@/utils/constants';
import { checkForUpdates, loadData, clearCache } from '@/lib/dataService';

// データ更新チェック間隔（24時間）
const DATA_UPDATE_INTERVAL_MINUTES = 60 * 24;

// Extension install handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Trade Lens extension installed:', details);

  // Initialize default storage values
  chrome.storage.local.set(
    {
      [STORAGE_KEYS.USER_SETTINGS]: {
        defaultFromCountry: 'JP',
        defaultToCountry: 'CN',
        language: 'ja',
      },
      [STORAGE_KEYS.SEARCH_HISTORY]: [],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting initial data:', chrome.runtime.lastError);
      } else {
        console.log('Initial data set successfully');
      }
    }
  );

  // 初回インストール時にデータを読み込み
  if (details.reason === 'install') {
    initializeData();
  }
});

// Handle extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked:', tab);
});

// Handle messages from content scripts and popup
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
        saveSearchHistory(message.data)
          .then(() => {
            sendResponse({ success: true });
          })
          .catch((error) => {
            console.error('Save search history error:', error);
            sendResponse({ success: false, error: error.message });
          });
        return true;

      case 'GET_SEARCH_HISTORY':
        getSearchHistory()
          .then((history) => {
            sendResponse({ history });
          })
          .catch((error) => {
            console.error('Get search history error:', error);
            sendResponse({ error: error.message });
          });
        return true;

      case 'CHECK_DATA_UPDATES':
        checkDataUpdates()
          .then((hasUpdates) => {
            sendResponse({ hasUpdates });
          })
          .catch((error) => {
            console.error('Check data updates error:', error);
            sendResponse({ hasUpdates: false, error: error.message });
          });
        return true;

      case 'REFRESH_DATA':
        refreshData()
          .then(() => {
            sendResponse({ success: true });
          })
          .catch((error) => {
            console.error('Refresh data error:', error);
            sendResponse({ success: false, error: error.message });
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

// データ初期化
async function initializeData() {
  try {
    console.log('Trade Lens: Initializing data...');
    await loadData();
    console.log('Trade Lens: Data initialized successfully');
  } catch (error) {
    console.error('Trade Lens: Failed to initialize data:', error);
  }
}

// データ更新チェック
async function checkDataUpdates(): Promise<boolean> {
  try {
    const hasUpdates = await checkForUpdates();
    console.log('Trade Lens: Data update check result:', hasUpdates);
    return hasUpdates;
  } catch (error) {
    console.error('Trade Lens: Failed to check for updates:', error);
    return false;
  }
}

// データ更新
async function refreshData(): Promise<void> {
  try {
    console.log('Trade Lens: Refreshing data...');
    await clearCache();
    await loadData(true);
    console.log('Trade Lens: Data refreshed successfully');
  } catch (error) {
    console.error('Trade Lens: Failed to refresh data:', error);
    throw error;
  }
}

// 検索履歴の保存
async function saveSearchHistory(searchData: any) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.SEARCH_HISTORY]);
    const history = result[STORAGE_KEYS.SEARCH_HISTORY] || [];

    const newSearch = {
      id: Date.now().toString(),
      ...searchData,
      timestamp: new Date().toISOString(),
    };

    // 最大50件まで保持
    const updatedHistory = [newSearch, ...history].slice(0, 50);

    await chrome.storage.local.set({
      [STORAGE_KEYS.SEARCH_HISTORY]: updatedHistory,
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
  if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
    console.warn('Chrome Extension context not available');
    return false;
  }

  console.log('Initializing Chrome APIs safely...');

  // アラーム機能の初期化（データ更新チェック用）
  try {
    if (chrome.alarms) {
      // 既存のアラームをクリア
      chrome.alarms.clear('dataUpdate');

      // データ更新チェックアラームを設定
      chrome.alarms.create('dataUpdate', {
        delayInMinutes: DATA_UPDATE_INTERVAL_MINUTES,
        periodInMinutes: DATA_UPDATE_INTERVAL_MINUTES,
      });

      // アラームリスナー
      chrome.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === 'dataUpdate') {
          console.log('Trade Lens: Checking for data updates...');
          try {
            const hasUpdates = await checkDataUpdates();
            if (hasUpdates) {
              console.log('Trade Lens: Updates available, refreshing data...');
              await refreshData();
            }
          } catch (error) {
            console.error('Trade Lens: Error during scheduled update check:', error);
          }
        }
      });

      console.log('Data update alarm initialized (interval:', DATA_UPDATE_INTERVAL_MINUTES, 'minutes)');
    }
  } catch (error) {
    console.warn('Alarms API not available or failed to initialize:', error);
  }

  return true;
}

// Service Worker 起動時に初期化
console.log('Trade Lens background script loaded');
safeInitializeChromeAPIs();

export {};
