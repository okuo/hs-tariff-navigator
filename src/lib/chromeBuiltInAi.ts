export type ChromeAiAvailability = 'available' | 'downloadable' | 'downloading' | 'unavailable';

export interface ChromeAiKeywordSuggestion {
  search_query: string;
  keywords_ja: string[];
  keywords_en: string[];
  materials: string[];
  use_terms: string[];
  notes: string[];
}

type ChromeAiPromptRole = 'system' | 'user' | 'assistant';

interface ChromeAiPromptMessage {
  role: ChromeAiPromptRole;
  content: string;
  prefix?: boolean;
}

interface ChromeAiCreateOptions {
  expectedInputs?: Array<{ type: 'text'; languages: string[] }>;
  expectedOutputs?: Array<{ type: 'text'; languages: string[] }>;
  monitor?: (monitor: EventTarget) => void;
  signal?: AbortSignal;
  temperature?: number;
  topK?: number;
}

interface ChromeAiPromptOptions {
  responseConstraint?: Record<string, unknown>;
  signal?: AbortSignal;
}

interface ChromeAiSession {
  prompt(input: string | ChromeAiPromptMessage[], options?: ChromeAiPromptOptions): Promise<string>;
  destroy?: () => void;
}

interface ChromeLanguageModelApi {
  availability(options?: ChromeAiCreateOptions): Promise<ChromeAiAvailability>;
  create(options?: ChromeAiCreateOptions): Promise<ChromeAiSession>;
}

declare global {
  interface Window {
    LanguageModel?: ChromeLanguageModelApi;
  }
}

type ChromeAiGlobal = typeof globalThis & {
  LanguageModel?: ChromeLanguageModelApi;
};

const CHROME_AI_SESSION_OPTIONS: ChromeAiCreateOptions = {
  expectedInputs: [{ type: 'text', languages: ['ja', 'en'] }],
  expectedOutputs: [{ type: 'text', languages: ['ja'] }],
};

const KEYWORD_RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    search_query: { type: 'string' },
    keywords_ja: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 8,
    },
    keywords_en: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 8,
    },
    materials: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 8,
    },
    use_terms: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 8,
    },
    notes: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 4,
    },
  },
  required: ['search_query', 'keywords_ja', 'keywords_en', 'materials', 'use_terms', 'notes'],
};

export function getChromeLanguageModelApi(): ChromeLanguageModelApi | null {
  const globalLanguageModel = (globalThis as ChromeAiGlobal).LanguageModel;

  if (globalLanguageModel) {
    return globalLanguageModel;
  }

  return null;
}

export async function getChromeAiAvailability(): Promise<ChromeAiAvailability> {
  const languageModel = getChromeLanguageModelApi();

  if (!languageModel) {
    return 'unavailable';
  }

  try {
    return await languageModel.availability(CHROME_AI_SESSION_OPTIONS);
  } catch {
    return 'unavailable';
  }
}

function normalizeTermList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function coerceString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function extractJsonObject(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1]?.trim() ?? trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Chrome内蔵AIの応答をJSONとして解析できませんでした。');
  }

  return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
}

function normalizeSuggestion(parsed: Record<string, unknown>): ChromeAiKeywordSuggestion {
  const keywordsJa = normalizeTermList(parsed.keywords_ja);
  const keywordsEn = normalizeTermList(parsed.keywords_en);
  const materials = normalizeTermList(parsed.materials);
  const useTerms = normalizeTermList(parsed.use_terms);
  const notes = normalizeTermList(parsed.notes).slice(0, 4);
  const fallbackQuery = [...keywordsJa, ...keywordsEn, ...materials, ...useTerms].slice(0, 5).join(' ');
  const searchQuery = coerceString(parsed.search_query) || fallbackQuery;

  if (!searchQuery) {
    throw new Error('検索に使えるキーワードを生成できませんでした。');
  }

  return {
    search_query: searchQuery.slice(0, 80),
    keywords_ja: keywordsJa,
    keywords_en: keywordsEn,
    materials,
    use_terms: useTerms,
    notes,
  };
}

function buildKeywordPrompt(description: string): ChromeAiPromptMessage[] {
  return [
    {
      role: 'system',
      content: [
        'あなたは貿易実務の事前調査を補助するHSコード検索アシスタントです。',
        'HSコードや関税率を断定せず、検索に使う短いキーワードだけを整理してください。',
        '回答はJSONオブジェクトのみ。Markdownや説明文は不要です。',
      ].join('\n'),
    },
    {
      role: 'user',
      content: [
        '次の商品説明から、TariffScopeのHSコード検索に入力する短い検索語を作ってください。',
        '',
        `商品説明: ${description}`,
      ].join('\n'),
    },
  ];
}

function getFriendlyChromeAiError(error: unknown): Error {
  if (error instanceof DOMException) {
    if (error.name === 'AbortError') {
      return new Error('Chrome内蔵AIの応答がタイムアウトしました。しばらくしてから再試行してください。');
    }

    if (error.name === 'NotSupportedError') {
      return new Error('このChrome環境では日本語入力または出力のPrompt APIがサポートされていません。');
    }

    if (error.name === 'QuotaExceededError') {
      return new Error('商品説明が長すぎます。短く要約してから再試行してください。');
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('Chrome内蔵AIで検索語を作成できませんでした。');
}

export async function generateHsSearchKeywordsWithChromeAi(
  description: string,
  onDownloadProgress?: (progress: number) => void,
  timeoutMs = 30000
): Promise<ChromeAiKeywordSuggestion> {
  const normalizedDescription = description.trim();

  if (normalizedDescription.length < 2) {
    throw new Error('商品説明を2文字以上入力してください。');
  }

  const languageModel = getChromeLanguageModelApi();

  if (!languageModel) {
    throw new Error('Chrome内蔵AIを利用できません。対応ChromeでPrompt APIを有効にしてください。');
  }

  const availability = await languageModel.availability(CHROME_AI_SESSION_OPTIONS);
  if (availability === 'unavailable') {
    throw new Error('この端末ではChrome内蔵AIを利用できません。Chromeのバージョン、端末要件、モデルの有効化状態を確認してください。');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let session: ChromeAiSession | null = null;

  try {
    session = await languageModel.create({
      ...CHROME_AI_SESSION_OPTIONS,
      signal: controller.signal,
      monitor(monitor) {
        monitor.addEventListener('downloadprogress', (event) => {
          const progressEvent = event as ProgressEvent;
          if (progressEvent.loaded) {
            onDownloadProgress?.(Math.round(progressEvent.loaded * 100));
          }
        });
      },
    });

    const responseText = await session.prompt(buildKeywordPrompt(normalizedDescription), {
      responseConstraint: KEYWORD_RESPONSE_SCHEMA,
      signal: controller.signal,
    });

    return normalizeSuggestion(extractJsonObject(responseText));
  } catch (error) {
    throw getFriendlyChromeAiError(error);
  } finally {
    clearTimeout(timeoutId);
    session?.destroy?.();
  }
}
