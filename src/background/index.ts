// Service Worker for Chrome Extension
import { STORAGE_KEYS } from '@/utils/constants';
import { checkForUpdates, loadData, clearCache } from '@/lib/dataService';
import { searchHistoryRepository } from '@/lib/searchHistoryRepository';
import { isExtensionMessage, type ExtensionMessage } from '@/types/messages';
import { getInitialStorageValues } from './installation';

// データ更新チェック間隔（24時間）
const DATA_UPDATE_INTERVAL_MINUTES = 60 * 24;

type HSCodeClickedMessage = Extract<ExtensionMessage, { type: 'HS_CODE_CLICKED' }>;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// Extension install handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('TariffScope extension installed:', details);

  const initialStorageValues = getInitialStorageValues(details.reason);
  if (!initialStorageValues) {
    return;
  }

  chrome.storage.local.set(
    initialStorageValues,
    () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting initial data:', chrome.runtime.lastError);
      } else {
        console.log('Initial data set successfully');
      }
    }
  );

  initializeData();
});

// Handle extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked:', tab);
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
  console.log('Message received:', message);

  if (!isExtensionMessage(message)) {
    sendResponse({ error: 'Unknown message type' });
    return false;
  }

  try {
    switch (message.type) {
      case 'GET_CURRENT_URL':
        if (sender.tab) {
          sendResponse({ url: sender.tab.url });
        } else {
          sendResponse({ error: 'No tab information available' });
        }
        break;

      case 'HS_CODE_CLICKED':
        savePendingHSCodeSelection(message)
          .then(() => {
            sendResponse({ success: true });
          })
          .catch((error) => {
            console.error('Save pending HS code error:', error);
            sendResponse({ success: false, error: getErrorMessage(error) });
          });
        return true;

      case 'SAVE_SEARCH_HISTORY':
        searchHistoryRepository.add(message.data)
          .then(() => {
            sendResponse({ success: true });
          })
          .catch((error) => {
            console.error('Save search history error:', error);
            sendResponse({ success: false, error: getErrorMessage(error) });
          });
        return true;

      case 'GET_SEARCH_HISTORY':
        searchHistoryRepository.getAll()
          .then((history) => {
            sendResponse({ history });
          })
          .catch((error) => {
            console.error('Get search history error:', error);
            sendResponse({ error: getErrorMessage(error) });
          });
        return true;

      case 'CHECK_DATA_UPDATES':
        checkDataUpdates()
          .then((hasUpdates) => {
            sendResponse({ hasUpdates });
          })
          .catch((error) => {
            console.error('Check data updates error:', error);
            sendResponse({ hasUpdates: false, error: getErrorMessage(error) });
          });
        return true;

      case 'REFRESH_DATA':
        refreshData()
          .then(() => {
            sendResponse({ success: true });
          })
          .catch((error) => {
            console.error('Refresh data error:', error);
            sendResponse({ success: false, error: getErrorMessage(error) });
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

function normalizeHSCode(rawValue: unknown): string | null {
  if (typeof rawValue !== 'string') {
    return null;
  }

  const normalized = rawValue.replace(/[^0-9]/g, '');
  if (normalized.length < 6 || normalized.length > 10) {
    return null;
  }
  return normalized;
}

async function tryOpenPopup(): Promise<void> {
  const actionWithPopup = chrome.action as typeof chrome.action & {
    openPopup?: () => Promise<void>;
  };

  try {
    await actionWithPopup.openPopup?.();
  } catch (error) {
    console.debug('TariffScope: Popup could not be opened automatically:', error);
  }
}

async function savePendingHSCodeSelection(message: HSCodeClickedMessage): Promise<void> {
  const hsCode = normalizeHSCode(message.hsCode);
  if (!hsCode) {
    throw new Error('Invalid HS code');
  }

  await chrome.storage.local.set({
    [STORAGE_KEYS.PENDING_HS_CODE]: {
      hsCode,
      url: message.url,
      context: message.context ?? null,
      detected_at: new Date().toISOString(),
    },
  });

  await tryOpenPopup();
}

// データ初期化
async function initializeData() {
  try {
    console.log('TariffScope: Initializing data...');
    await loadData();
    console.log('TariffScope: Data initialized successfully');
  } catch (error) {
    console.error('TariffScope: Failed to initialize data:', error);
  }
}

// データ更新チェック
async function checkDataUpdates(): Promise<boolean> {
  try {
    const hasUpdates = await checkForUpdates();
    console.log('TariffScope: Data update check result:', hasUpdates);
    return hasUpdates;
  } catch (error) {
    console.error('TariffScope: Failed to check for updates:', error);
    return false;
  }
}

// データ更新
async function refreshData(): Promise<void> {
  try {
    console.log('TariffScope: Refreshing data...');
    await clearCache();
    await loadData(true);
    console.log('TariffScope: Data refreshed successfully');
  } catch (error) {
    console.error('TariffScope: Failed to refresh data:', error);
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
          console.log('TariffScope: Checking for data updates...');
          try {
            const hasUpdates = await checkDataUpdates();
            if (hasUpdates) {
              console.log('TariffScope: Updates available, refreshing data...');
              await refreshData();
            }
          } catch (error) {
            console.error('TariffScope: Error during scheduled update check:', error);
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
console.log('TariffScope background script loaded');
safeInitializeChromeAPIs();

export {};
