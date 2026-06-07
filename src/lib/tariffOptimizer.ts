/**
 * 関税最適化ロジック
 * PostgreSQLのoptimize_tariff関数をJavaScriptで再実装
 */

import type { Agreement, AgreementRate, DataReference, OptimizationResult } from '../types';
import {
  getManifestDataReference,
  getTariffRateReference,
  type DataManifest,
  type TariffRateData
} from './dataService';
import { EU_MEMBER_CODES } from '@/utils/constants';

// デフォルトの基本関税率
const DEFAULT_BASE_RATE = 10.0;

/**
 * 指定された国が協定に参加しているか確認
 */
function isCountryInAgreement(agreement: Agreement, country: string): boolean {
  return expandCountryCode(country).some((countryCode) => agreement.countries.includes(countryCode));
}

function expandCountryCode(country: string): string[] {
  if (country === 'EU') {
    return [...EU_MEMBER_CODES];
  }
  return [country];
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
  const fromCountryCodes = expandCountryCode(fromCountry);
  const toCountryCodes = expandCountryCode(toCountry);

  return tariffRates.find(
    (tr) =>
      tr.hs_code === hsCode &&
      fromCountryCodes.includes(tr.country_from) &&
      toCountryCodes.includes(tr.country_to) &&
      tr.agreement_id === agreementId
  );
}

type BaseRateResult = {
  rate: number;
  source: 'actual' | 'fallback_hs' | 'default';
  tariffRate?: TariffRateData;
};

/**
 * 基本関税率を取得
 */
function getBaseRate(
  tariffRates: TariffRateData[],
  hsCode: string,
  fromCountry: string,
  toCountry: string
): BaseRateResult {
  const fromCountryCodes = expandCountryCode(fromCountry);
  const toCountryCodes = expandCountryCode(toCountry);

  // MFN（最恵国待遇）レートを探す
  const mfnRate = tariffRates.find(
    (tr) =>
      tr.hs_code === hsCode &&
      fromCountryCodes.includes(tr.country_from) &&
      toCountryCodes.includes(tr.country_to) &&
      tr.agreement_id === null
  );

  if (mfnRate) {
    return {
      rate: mfnRate.base_rate,
      source: 'actual',
      tariffRate: mfnRate,
    };
  }

  // 該当HSコードの任意のレートから基本関税率を取得
  const anyRate = tariffRates.find((tr) => tr.hs_code === hsCode);
  if (anyRate) {
    return {
      rate: anyRate.base_rate,
      source: 'fallback_hs',
      tariffRate: anyRate,
    };
  }

  return {
    rate: DEFAULT_BASE_RATE,
    source: 'default',
  };
}

/**
 * 優遇関税率を計算（データがない場合の推定）
 */
function calculatePreferentialRate(baseRate: number, priority: number): number {
  // 優先度に基づいて削減率を推定（優先度が低いほど削減率が高い）
  const reductionFactor = Math.max(0, 1 - priority * 0.05);
  return Math.max(0, baseRate * reductionFactor);
}

function buildEstimatedRateReference(datasetReference: DataReference): DataReference {
  return {
    ...datasetReference,
    source_name: 'TariffScope参考推定',
    source_note: '収録税率ではなく、協定優先度と基本税率に基づく参考推定です。',
  };
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
    manifest?: DataManifest;
  }
): OptimizationResult {
  const { agreements, tariffRates, manifest } = data;
  const datasetReference = getManifestDataReference(manifest);

  // 基本関税率を取得
  const baseRateResult = getBaseRate(tariffRates, hsCode, fromCountry, toCountry);
  const baseRate = baseRateResult.rate;
  const baseRateReference = baseRateResult.tariffRate
    ? getTariffRateReference(baseRateResult.tariffRate, manifest)
    : buildEstimatedRateReference(datasetReference);

  // 適用可能な協定を取得
  const applicableAgreements = getApplicableAgreements(agreements, fromCountry, toCountry);

  // 有効な取引金額
  const effectiveTradeValue = tradeValue && tradeValue > 0 ? tradeValue : 1000000;

  // 各協定のレート計算
  const dataWarnings: string[] = [];
  if (fromCountry === 'EU' || toCountry === 'EU') {
    dataWarnings.push('EUは収録済み加盟国コードを代表値として照合しています。加盟国別の実データがある場合は個別国での確認も推奨します。');
  }
  if (baseRateResult.source === 'fallback_hs') {
    dataWarnings.push('この貿易ルートのMFN税率が未収録のため、同一HSコードの収録税率を参考値として使用しています。');
  } else if (baseRateResult.source === 'default') {
    dataWarnings.push('このHSコードのMFN税率が未収録のため、標準の参考税率を使用しています。');
  }

  const agreementRates: AgreementRate[] = applicableAgreements.map((agreement) => {
    // 該当する関税率を検索
    const tariffRate = findTariffRate(tariffRates, hsCode, fromCountry, toCountry, agreement.id);

    // 優遇関税率を決定
    let preferentialRate: number;
    let rateSource: AgreementRate['rate_source'] = 'actual';
    let dataNote: string | undefined;
    let reference: DataReference;
    if (tariffRate) {
      preferentialRate = tariffRate.preferential_rate;
      reference = getTariffRateReference(tariffRate, manifest);
    } else {
      // データがない場合は推定
      preferentialRate = calculatePreferentialRate(baseRate, agreement.priority);
      rateSource = 'estimated';
      dataNote = 'この協定の税率データは未収録のため、協定優先度に基づく参考推定です。';
      reference = buildEstimatedRateReference(datasetReference);
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
      rate_source: rateSource,
      data_note: dataNote,
      reference,
    };
  });

  const estimatedCount = agreementRates.filter((rate) => rate.rate_source === 'estimated').length;
  if (estimatedCount > 0) {
    dataWarnings.push(`${estimatedCount}件の協定税率は未収録のため、参考推定として表示しています。`);
  }

  // 最適協定を選択（実データがある場合は実データを優先）
  const comparableRates = agreementRates.some((rate) => rate.rate_source === 'actual')
    ? agreementRates.filter((rate) => rate.rate_source === 'actual')
    : agreementRates;
  const bestAgreement = comparableRates.reduce<AgreementRate | undefined>(
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
    base_rate_source: baseRateResult.source,
    base_rate_reference: baseRateReference,
    agreements: agreementRates,
    best_agreement: bestAgreement,
    trade_value: effectiveTradeValue,
    data_reference: datasetReference,
    data_warnings: dataWarnings,
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
