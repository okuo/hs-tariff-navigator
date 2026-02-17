/**
 * 3-gram検索アルゴリズム
 * PostgreSQLのpg_trgm拡張と同等の類似度検索をJavaScriptで実装
 */

import type { HSCode } from '../types';

export interface SearchResult extends HSCode {
  rank: number;
}

/**
 * 3-gramトークンを生成
 * @param text 入力テキスト
 * @returns 3-gramのセット
 */
function generateTrigrams(text: string): Set<string> {
  const normalized = text.toLowerCase().trim();
  const trigrams = new Set<string>();

  // パディングを追加して先頭・末尾も検索可能に
  const padded = `  ${normalized} `;

  for (let i = 0; i < padded.length - 2; i++) {
    trigrams.add(padded.substring(i, i + 3));
  }

  return trigrams;
}

/**
 * Jaccard係数で類似度を計算
 * @param text1 テキスト1
 * @param text2 テキスト2
 * @returns 類似度（0-1）
 */
function calculateSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;

  const trigrams1 = generateTrigrams(text1);
  const trigrams2 = generateTrigrams(text2);

  const intersection = new Set([...trigrams1].filter((t) => trigrams2.has(t)));
  const union = new Set([...trigrams1, ...trigrams2]);

  if (union.size === 0) return 0;

  return intersection.size / union.size;
}

/**
 * 部分一致を確認
 * @param haystack 検索対象文字列
 * @param needle 検索語
 * @returns 部分一致するかどうか
 */
function containsMatch(haystack: string, needle: string): boolean {
  if (!haystack || !needle) return false;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/**
 * HSコードを検索
 * @param searchTerm 検索語
 * @param hsCodeData HSコードデータ配列
 * @param limit 結果の最大件数
 * @returns 検索結果（ランク付き）
 */
export function searchHSCodes(
  searchTerm: string,
  hsCodeData: HSCode[],
  limit: number = 10
): SearchResult[] {
  if (!searchTerm || !hsCodeData?.length) {
    return [];
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const results = hsCodeData
    .map((item) => {
      // 完全一致・部分一致チェック
      const codeExactMatch = item.code === normalizedSearch;
      const codeMatch = containsMatch(item.code, normalizedSearch);
      const jaMatch = containsMatch(item.description_ja, normalizedSearch);
      const enMatch = containsMatch(item.description_en, normalizedSearch);

      // 類似度計算（スコアリング重み付け）
      const codeSimilarity = calculateSimilarity(item.code, normalizedSearch) * 3.0;
      const jaSimilarity = calculateSimilarity(item.description_ja, normalizedSearch) * 2.0;
      const enSimilarity = calculateSimilarity(item.description_en, normalizedSearch) * 1.5;

      // ランク計算
      let rank = 0;

      // 完全一致は最高スコア
      if (codeExactMatch) {
        rank = 100;
      } else if (codeMatch) {
        rank = Math.max(rank, 10.0);
      }

      // 部分一致
      if (jaMatch) {
        rank = Math.max(rank, 8.0);
      }
      if (enMatch) {
        rank = Math.max(rank, 6.0);
      }

      // 類似度ベースのスコア
      rank = Math.max(rank, codeSimilarity, jaSimilarity, enSimilarity);

      return { ...item, rank };
    })
    .filter((item) => item.rank > 0.1)
    .sort((a, b) => {
      // ランクで降順ソート、同じ場合はコードで昇順
      if (b.rank !== a.rank) {
        return b.rank - a.rank;
      }
      return a.code.localeCompare(b.code);
    })
    .slice(0, limit);

  return results;
}

/**
 * カテゴリでHSコードをフィルタリング
 * @param hsCodeData HSコードデータ配列
 * @param category カテゴリ名
 * @returns フィルタリングされたHSコード
 */
export function filterByCategory(hsCodeData: HSCode[], category: string): HSCode[] {
  if (!category) return hsCodeData;
  return hsCodeData.filter(
    (item) =>
      (item as any).category?.toLowerCase() === category.toLowerCase() ||
      (item as any).subcategory?.toLowerCase() === category.toLowerCase()
  );
}

/**
 * HSコードから商品を取得
 * @param code HSコード
 * @param hsCodeData HSコードデータ配列
 * @returns マッチしたHSコード
 */
export function getHSCodeByCode(code: string, hsCodeData: HSCode[]): HSCode | undefined {
  return hsCodeData.find((item) => item.code === code);
}

/**
 * 全カテゴリを取得
 * @param hsCodeData HSコードデータ配列
 * @returns カテゴリ名の配列
 */
export function getAllCategories(hsCodeData: HSCode[]): string[] {
  const categories = new Set<string>();
  hsCodeData.forEach((item) => {
    if ((item as any).category) {
      categories.add((item as any).category);
    }
  });
  return Array.from(categories).sort();
}

export default searchHSCodes;
