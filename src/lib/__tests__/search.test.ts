import { searchHSCodes, filterByCategory, getHSCodeByCode, getAllCategories } from '../search';
import type { HSCode } from '../../types';

const sampleHSCodes: HSCode[] = [
  {
    code: '0101.21',
    description_ja: '純粋種の繁殖用の馬',
    description_en: 'Pure-bred breeding horses',
    unit: 'NO',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    code: '0207.14',
    description_ja: '鶏の骨付き肉（冷凍）',
    description_en: 'Frozen cuts and offal of chickens',
    unit: 'KG',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    code: '8471.30',
    description_ja: 'ポータブルデジタル自動データ処理機械',
    description_en: 'Portable digital automatic data processing machines',
    unit: 'NO',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    code: '8517.12',
    description_ja: '携帯電話',
    description_en: 'Telephones for cellular networks',
    unit: 'NO',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    code: '6204.62',
    description_ja: '綿製の女性用ズボン',
    description_en: "Women's trousers of cotton",
    unit: 'NO',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

describe('searchHSCodes', () => {
  it('should return empty array for empty search term', () => {
    const result = searchHSCodes('', sampleHSCodes);
    expect(result).toEqual([]);
  });

  it('should return empty array for null/undefined data', () => {
    const result = searchHSCodes('test', []);
    expect(result).toEqual([]);
  });

  it('should search by Japanese keyword', () => {
    const result = searchHSCodes('携帯電話', sampleHSCodes);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].code).toBe('8517.12');
  });

  it('should search by English keyword', () => {
    const result = searchHSCodes('horses', sampleHSCodes);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].code).toBe('0101.21');
  });

  it('should search by HS code number directly', () => {
    const result = searchHSCodes('8471.30', sampleHSCodes);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].code).toBe('8471.30');
    expect(result[0].rank).toBe(100); // exact match
  });

  it('should search by partial HS code', () => {
    const result = searchHSCodes('8517', sampleHSCodes);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].code).toBe('8517.12');
  });

  it('should handle special characters in search', () => {
    const result = searchHSCodes('(冷凍)', sampleHSCodes);
    // Should not throw and should return results or empty array
    expect(Array.isArray(result)).toBe(true);
  });

  it('should respect the limit parameter', () => {
    const result = searchHSCodes('a', sampleHSCodes, 2);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('should return results sorted by rank descending', () => {
    const result = searchHSCodes('chicken', sampleHSCodes);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].rank).toBeGreaterThanOrEqual(result[i].rank);
    }
  });

  it('should assign higher rank to exact code match than partial match', () => {
    const result = searchHSCodes('8471.30', sampleHSCodes);
    const exactMatch = result.find((r) => r.code === '8471.30');
    expect(exactMatch).toBeDefined();
    expect(exactMatch!.rank).toBe(100);
  });

  it('should handle whitespace-only search term', () => {
    const result = searchHSCodes('   ', sampleHSCodes);
    expect(result).toEqual([]);
  });

  it('should default limit to 10', () => {
    const manyItems: HSCode[] = Array.from({ length: 20 }, (_, i) => ({
      code: `0000.${String(i).padStart(2, '0')}`,
      description_ja: `テスト商品${i}`,
      description_en: `Test product ${i}`,
      unit: 'KG',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }));
    const result = searchHSCodes('テスト', manyItems);
    expect(result.length).toBeLessThanOrEqual(10);
  });
});

describe('getHSCodeByCode', () => {
  it('should return the matching HS code', () => {
    const result = getHSCodeByCode('8517.12', sampleHSCodes);
    expect(result).toBeDefined();
    expect(result!.description_ja).toBe('携帯電話');
  });

  it('should return undefined for non-existent code', () => {
    const result = getHSCodeByCode('9999.99', sampleHSCodes);
    expect(result).toBeUndefined();
  });
});

describe('filterByCategory', () => {
  const dataWithCategories = sampleHSCodes.map((item, i) => ({
    ...item,
    category: i < 2 ? 'Animals' : 'Electronics',
  }));

  it('should filter by category name', () => {
    const result = filterByCategory(dataWithCategories, 'Animals');
    expect(result.length).toBe(2);
  });

  it('should be case-insensitive', () => {
    const result = filterByCategory(dataWithCategories, 'animals');
    expect(result.length).toBe(2);
  });

  it('should return all items when category is empty', () => {
    const result = filterByCategory(dataWithCategories, '');
    expect(result.length).toBe(dataWithCategories.length);
  });
});

describe('getAllCategories', () => {
  it('should return unique sorted categories', () => {
    const dataWithCategories = sampleHSCodes.map((item, i) => ({
      ...item,
      category: i < 2 ? 'Animals' : 'Electronics',
    }));
    const result = getAllCategories(dataWithCategories);
    expect(result).toEqual(['Animals', 'Electronics']);
  });

  it('should return empty array when no categories exist', () => {
    const result = getAllCategories(sampleHSCodes);
    expect(result).toEqual([]);
  });
});
