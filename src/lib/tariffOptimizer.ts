/**
 * 関税最適化ロジック
 * PostgreSQLのoptimize_tariff関数をJavaScriptで再実装
 */

import type { Agreement, AgreementRate, OptimizationResult } from '../types';
import type { TariffRateData } from './dataService';

// デフォルトの基本関税率
const DEFAULT_BASE_RATE = 10.0;

/**
 * 指定された国が協定に参加しているか確認
 */
function isCountryInAgreement(agreement: Agreement, country: string): boolean {
  return agreement.countries.includes(country);
}

/**
 * 両国が参加している有効な協定をフィルタリング
 */
function getApplicableAgreements(
  agreements: Agreement[],
  fromCountry: string,
  toCountry: string
): Agreement[] {
  return agreements
    .filter(
      (agreement) =>
        agreement.is_active &&
        isCountryInAgreement(agreement, fromCountry) &&
        isCountryInAgreement(agreement, toCountry)
    )
    .sort((a, b) => a.priority - b.priority);
}

/**
 * 関税率データから該当するレートを検索
 */
function findTariffRate(
  tariffRates: TariffRateData[],
  hsCode: string,
  fromCountry: string,
  toCountry: string,
  agreementId: string | null
): TariffRateData | undefined {
  return tariffRates.find(
    (tr) =>
      tr.hs_code === hsCode &&
      tr.country_from === fromCountry &&
      tr.country_to === toCountry &&
      tr.agreement_id === agreementId
  );
}

/**
 * 基本関税率を取得
 */
function getBaseRate(
  tariffRates: TariffRateData[],
  hsCode: string,
  fromCountry: string,
  toCountry: string
): number {
  // MFN（最恵国待遇）レートを探す
  const mfnRate = tariffRates.find(
    (tr) =>
      tr.hs_code === hsCode &&
      tr.country_from === fromCountry &&
      tr.country_to === toCountry &&
      tr.agreement_id === null
  );

  if (mfnRate) {
    return mfnRate.base_rate;
  }

  // 該当HSコードの任意のレートから基本関税率を取得
  const anyRate = tariffRates.find((tr) => tr.hs_code === hsCode);
  return anyRate?.base_rate ?? DEFAULT_BASE_RATE;
}

/**
 * 優遇関税率を計算（データがない場合の推定）
 */
function calculatePreferentialRate(baseRate: number, priority: number): number {
  // 優先度に基づいて削減率を推定（優先度が低いほど削減率が高い）
  const reductionFactor = Math.max(0, 1 - priority * 0.05);
  return Math.max(0, baseRate * reductionFactor);
}

/**
 * 関税最適化を実行
 */
export function optimizeTariff(
  hsCode: string,
  fromCountry: string,
  toCountry: string,
  tradeValue: number | null,
  data: {
    agreements: Agreement[];
    tariffRates: TariffRateData[];
  }
): OptimizationResult {
  const { agreements, tariffRates } = data;

  // 基本関税率を取得
  const baseRate = getBaseRate(tariffRates, hsCode, fromCountry, toCountry);

  // 適用可能な協定を取得
  const applicableAgreements = getApplicableAgreements(agreements, fromCountry, toCountry);

  // 有効な取引金額
  const effectiveTradeValue = tradeValue && tradeValue > 0 ? tradeValue : 1000000;

  // 各協定のレート計算
  const agreementRates: AgreementRate[] = applicableAgreements.map((agreement) => {
    // 該当する関税率を検索
    const tariffRate = findTariffRate(tariffRates, hsCode, fromCountry, toCountry, agreement.id);

    // 優遇関税率を決定
    let preferentialRate: number;
    if (tariffRate) {
      preferentialRate = tariffRate.preferential_rate;
    } else {
      // データがない場合は推定
      preferentialRate = calculatePreferentialRate(baseRate, agreement.priority);
    }

    // 削減額・削減率を計算
    const savingsAmount = (effectiveTradeValue * (baseRate - preferentialRate)) / 100;
    const savingsPercentage = baseRate > 0 ? ((baseRate - preferentialRate) / baseRate) * 100 : 0;

    return {
      agreement,
      rate: preferentialRate,
      savings_amount: Math.round(savingsAmount * 100) / 100,
      savings_percentage: Math.round(savingsPercentage * 100) / 100,
      conditions: tariffRate?.conditions ?? null,
    };
  });

  // 最適協定を選択（削減額が最大のもの）
  const bestAgreement = agreementRates.reduce<AgreementRate | undefined>(
    (best, current) => {
      if (!best || current.savings_amount > best.savings_amount) {
        return current;
      }
      return best;
    },
    undefined
  );

  return {
    hs_code: hsCode,
    from_country: fromCountry,
    to_country: toCountry,
    base_rate: baseRate,
    agreements: agreementRates,
    best_agreement: bestAgreement,
    trade_value: tradeValue ?? 0,
  };
}

/**
 * 国ペアで利用可能な協定を取得
 */
export function getAgreementsByCountries(
  agreements: Agreement[],
  fromCountry: string,
  toCountry: string
): Agreement[] {
  return getApplicableAgreements(agreements, fromCountry, toCountry);
}

/**
 * HSコードの全協定関税率を取得
 */
export function getTariffRatesForHSCode(
  tariffRates: TariffRateData[],
  hsCode: string
): TariffRateData[] {
  return tariffRates.filter((tr) => tr.hs_code === hsCode);
}

/**
 * 特定協定の関税率を取得
 */
export function getTariffRateForAgreement(
  tariffRates: TariffRateData[],
  hsCode: string,
  fromCountry: string,
  toCountry: string,
  agreementId: string
): TariffRateData | undefined {
  return findTariffRate(tariffRates, hsCode, fromCountry, toCountry, agreementId);
}

export default optimizeTariff;
