import type { SearchHistoryEntry } from './index';

export type ExtensionMessage =
  | { type: 'GET_CURRENT_URL' }
  | {
      type: 'HS_CODE_CLICKED';
      hsCode: string;
      url?: string;
      context?: string | null;
    }
  | { type: 'SAVE_SEARCH_HISTORY'; data: SearchHistoryEntry }
  | { type: 'GET_SEARCH_HISTORY' }
  | { type: 'CHECK_DATA_UPDATES' }
  | { type: 'REFRESH_DATA' };

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

export function isExtensionMessage(value: unknown): value is ExtensionMessage {
  if (!isRecord(value) || typeof value.type !== 'string') {
    return false;
  }

  switch (value.type) {
    case 'GET_CURRENT_URL':
    case 'GET_SEARCH_HISTORY':
    case 'CHECK_DATA_UPDATES':
    case 'REFRESH_DATA':
      return true;
    case 'HS_CODE_CLICKED':
      return typeof value.hsCode === 'string';
    case 'SAVE_SEARCH_HISTORY':
      return isRecord(value.data);
    default:
      return false;
  }
}
