import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// 環境変数からSupabaseの設定を取得
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Supabaseクライアントの初期化
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export const initSupabase = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase環境変数が設定されていません。デモモードで動作します。');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        storageKey: 'trade-lens-auth',
        storage: {
          getItem: (key: string) => {
            if (typeof window !== 'undefined') {
              return window.localStorage.getItem(key);
            }
            return null;
          },
          setItem: (key: string, value: string) => {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(key, value);
            }
          },
          removeItem: (key: string) => {
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem(key);
            }
          }
        }
      },
      global: {
        headers: {
          'x-client-info': 'trade-lens-extension'
        }
      }
    });
  }

  return supabaseClient;
};

// Supabaseが利用可能かどうかをチェック
export const isSupabaseAvailable = (): boolean => {
  return !!(supabaseUrl && supabaseKey);
};

// 初期化されたSupabaseクライアントを取得
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
};

// デフォルトエクスポート（後方互換性のため）
export default getSupabaseClient;