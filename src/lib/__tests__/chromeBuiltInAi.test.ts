import {
  generateHsSearchKeywordsWithChromeAi,
  getChromeAiAvailability,
} from '../chromeBuiltInAi';

type LanguageModelTestApi = {
  availability: jest.Mock;
  create: jest.Mock;
};

type LanguageModelTestGlobal = typeof globalThis & {
  LanguageModel?: LanguageModelTestApi;
};

const languageModelGlobal = globalThis as LanguageModelTestGlobal;

describe('getChromeAiAvailability', () => {
  const originalLanguageModel = languageModelGlobal.LanguageModel;

  afterEach(() => {
    languageModelGlobal.LanguageModel = originalLanguageModel;
  });

  it('returns unavailable when the Prompt API is missing', async () => {
    languageModelGlobal.LanguageModel = undefined;

    await expect(getChromeAiAvailability()).resolves.toBe('unavailable');
  });

  it('returns the Prompt API availability value', async () => {
    languageModelGlobal.LanguageModel = {
      availability: jest.fn().mockResolvedValue('available'),
      create: jest.fn(),
    };

    await expect(getChromeAiAvailability()).resolves.toBe('available');
  });
});

describe('generateHsSearchKeywordsWithChromeAi', () => {
  const originalLanguageModel = languageModelGlobal.LanguageModel;
  let promptMock: jest.Mock;
  let destroyMock: jest.Mock;

  beforeEach(() => {
    promptMock = jest.fn();
    destroyMock = jest.fn();
    languageModelGlobal.LanguageModel = {
      availability: jest.fn().mockResolvedValue('available'),
      create: jest.fn().mockResolvedValue({
        prompt: promptMock,
        destroy: destroyMock,
      }),
    };
  });

  afterEach(() => {
    languageModelGlobal.LanguageModel = originalLanguageModel;
  });

  it('creates a Prompt API session and normalizes the JSON response', async () => {
    promptMock.mockResolvedValue([
      '```json',
      '{',
      '  "search_query": "自転車 ブレーキ レバー",',
      '  "keywords_ja": ["自転車", "ブレーキレバー"],',
      '  "keywords_en": ["bicycle brake lever"],',
      '  "materials": ["アルミ"],',
      '  "use_terms": ["交換部品"],',
      '  "notes": ["完成車ではなく部品として確認"]',
      '}',
      '```',
    ].join('\n'));

    const result = await generateHsSearchKeywordsWithChromeAi('アルミ製の自転車用ブレーキレバー');

    expect(result).toEqual({
      search_query: '自転車 ブレーキ レバー',
      keywords_ja: ['自転車', 'ブレーキレバー'],
      keywords_en: ['bicycle brake lever'],
      materials: ['アルミ'],
      use_terms: ['交換部品'],
      notes: ['完成車ではなく部品として確認'],
    });
    expect(languageModelGlobal.LanguageModel?.availability).toHaveBeenCalledWith({
      expectedInputs: [{ type: 'text', languages: ['ja', 'en'] }],
      expectedOutputs: [{ type: 'text', languages: ['ja'] }],
    });
    expect(languageModelGlobal.LanguageModel?.create).toHaveBeenCalledWith(
      expect.objectContaining({
        expectedInputs: [{ type: 'text', languages: ['ja', 'en'] }],
        expectedOutputs: [{ type: 'text', languages: ['ja'] }],
        monitor: expect.any(Function),
      })
    );
    expect(promptMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user' }),
      ]),
      expect.objectContaining({
        responseConstraint: expect.objectContaining({ type: 'object' }),
      })
    );
    expect(destroyMock).toHaveBeenCalled();
  });

  it('falls back to keyword arrays when search_query is missing', async () => {
    promptMock.mockResolvedValue(JSON.stringify({
      keywords_ja: ['綿製', 'ズボン'],
      keywords_en: ['cotton trousers'],
      materials: ['綿'],
      use_terms: ['衣類'],
      notes: [],
    }));

    const result = await generateHsSearchKeywordsWithChromeAi('綿製の女性用ズボン');

    expect(result.search_query).toBe('綿製 ズボン cotton trousers 綿 衣類');
  });

  it('returns a friendly error when Chrome built-in AI is unavailable', async () => {
    languageModelGlobal.LanguageModel = {
      availability: jest.fn().mockResolvedValue('unavailable'),
      create: jest.fn(),
    };

    await expect(
      generateHsSearchKeywordsWithChromeAi('アルミ製の自転車用ブレーキレバー')
    ).rejects.toThrow('Chrome内蔵AIを利用できません');
  });
});
