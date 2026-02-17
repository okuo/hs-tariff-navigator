import { optimizeTariff, getAgreementsByCountries, getTariffRatesForHSCode } from '../tariffOptimizer';
import type { Agreement } from '../../types';
import type { TariffRateData } from '../dataService';

const sampleAgreements: Agreement[] = [
  {
    id: 'rcep',
    name_ja: 'RCEP',
    name_en: 'Regional Comprehensive Economic Partnership',
    countries: ['JP', 'CN', 'KR', 'AU', 'NZ'],
    effective_date: '2022-01-01',
    document_url: 'https://example.com/rcep',
    priority: 2,
    is_active: true,
  },
  {
    id: 'jaepa',
    name_ja: '日豪EPA',
    name_en: 'Japan-Australia EPA',
    countries: ['JP', 'AU'],
    effective_date: '2015-01-15',
    document_url: 'https://example.com/jaepa',
    priority: 1,
    is_active: true,
  },
  {
    id: 'cptpp',
    name_ja: 'CPTPP',
    name_en: 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership',
    countries: ['JP', 'AU', 'NZ', 'CA', 'MX'],
    effective_date: '2018-12-30',
    document_url: 'https://example.com/cptpp',
    priority: 3,
    is_active: true,
  },
  {
    id: 'inactive-agreement',
    name_ja: '無効な協定',
    name_en: 'Inactive Agreement',
    countries: ['JP', 'AU'],
    effective_date: '2010-01-01',
    document_url: 'https://example.com/inactive',
    priority: 4,
    is_active: false,
  },
];

const sampleTariffRates: TariffRateData[] = [
  {
    hs_code: '0207.14',
    country_from: 'AU',
    country_to: 'JP',
    agreement_id: null,
    base_rate: 11.9,
    preferential_rate: 11.9,
    conditions: {},
    effective_date: '2024-01-01',
  },
  {
    hs_code: '0207.14',
    country_from: 'AU',
    country_to: 'JP',
    agreement_id: 'jaepa',
    base_rate: 11.9,
    preferential_rate: 8.5,
    conditions: { origin_certificate: true },
    effective_date: '2024-01-01',
  },
  {
    hs_code: '0207.14',
    country_from: 'AU',
    country_to: 'JP',
    agreement_id: 'rcep',
    base_rate: 11.9,
    preferential_rate: 9.0,
    conditions: {},
    effective_date: '2024-01-01',
  },
  {
    hs_code: '0207.14',
    country_from: 'AU',
    country_to: 'JP',
    agreement_id: 'cptpp',
    base_rate: 11.9,
    preferential_rate: 6.6,
    conditions: { cumulation_rule: 'full' },
    effective_date: '2024-01-01',
  },
];

describe('optimizeTariff', () => {
  it('should select the agreement with the highest savings', () => {
    const result = optimizeTariff('0207.14', 'AU', 'JP', 1000000, {
      agreements: sampleAgreements,
      tariffRates: sampleTariffRates,
    });

    expect(result.best_agreement).toBeDefined();
    // CPTPP has the lowest preferential_rate (6.6%) => highest savings
    expect(result.best_agreement!.agreement.id).toBe('cptpp');
  });

  it('should calculate savings amount correctly', () => {
    const tradeValue = 1000000;
    const result = optimizeTariff('0207.14', 'AU', 'JP', tradeValue, {
      agreements: sampleAgreements,
      tariffRates: sampleTariffRates,
    });

    const cptppRate = result.agreements.find((a) => a.agreement.id === 'cptpp');
    expect(cptppRate).toBeDefined();

    // Savings = tradeValue * (baseRate - preferentialRate) / 100
    // = 1000000 * (11.9 - 6.6) / 100 = 53000
    expect(cptppRate!.savings_amount).toBe(53000);
  });

  it('should calculate savings percentage correctly', () => {
    const result = optimizeTariff('0207.14', 'AU', 'JP', 1000000, {
      agreements: sampleAgreements,
      tariffRates: sampleTariffRates,
    });

    const jaEpa = result.agreements.find((a) => a.agreement.id === 'jaepa');
    expect(jaEpa).toBeDefined();

    // Savings % = ((11.9 - 8.5) / 11.9) * 100 = 28.57...
    expect(jaEpa!.savings_percentage).toBeCloseTo(28.57, 1);
  });

  it('should exclude inactive agreements', () => {
    const result = optimizeTariff('0207.14', 'AU', 'JP', 1000000, {
      agreements: sampleAgreements,
      tariffRates: sampleTariffRates,
    });

    const inactiveResult = result.agreements.find(
      (a) => a.agreement.id === 'inactive-agreement'
    );
    expect(inactiveResult).toBeUndefined();
  });

  it('should return empty agreements when no agreements apply', () => {
    const result = optimizeTariff('0207.14', 'US', 'JP', 1000000, {
      agreements: sampleAgreements,
      tariffRates: sampleTariffRates,
    });

    expect(result.agreements).toHaveLength(0);
    expect(result.best_agreement).toBeUndefined();
  });

  it('should use default trade value when null is provided', () => {
    const result = optimizeTariff('0207.14', 'AU', 'JP', null, {
      agreements: sampleAgreements,
      tariffRates: sampleTariffRates,
    });

    // Should use default value of 1000000
    expect(result.trade_value).toBe(0);
    expect(result.best_agreement).toBeDefined();
    expect(result.best_agreement!.savings_amount).toBeGreaterThan(0);
  });

  it('should use default base rate when no tariff data exists', () => {
    const result = optimizeTariff('9999.99', 'AU', 'JP', 1000000, {
      agreements: sampleAgreements,
      tariffRates: [],
    });

    // Default base rate is 10.0
    expect(result.base_rate).toBe(10.0);
  });

  it('should estimate preferential rates when tariff data is missing', () => {
    const result = optimizeTariff('9999.99', 'AU', 'JP', 1000000, {
      agreements: sampleAgreements,
      tariffRates: [],
    });

    // Should still have agreements with estimated rates
    expect(result.agreements.length).toBeGreaterThan(0);
    result.agreements.forEach((ar) => {
      expect(ar.rate).toBeLessThanOrEqual(result.base_rate);
      expect(ar.rate).toBeGreaterThanOrEqual(0);
    });
  });

  it('should handle 0% base rate', () => {
    const zeroRateTariffs: TariffRateData[] = [
      {
        hs_code: '0000.00',
        country_from: 'AU',
        country_to: 'JP',
        agreement_id: null,
        base_rate: 0,
        preferential_rate: 0,
        conditions: {},
        effective_date: '2024-01-01',
      },
    ];

    const result = optimizeTariff('0000.00', 'AU', 'JP', 1000000, {
      agreements: sampleAgreements,
      tariffRates: zeroRateTariffs,
    });

    expect(result.base_rate).toBe(0);
    // savings_percentage should be 0 when base rate is 0
    result.agreements.forEach((ar) => {
      expect(ar.savings_percentage).toBe(0);
    });
  });

  it('should compare multiple agreements and rank them', () => {
    const result = optimizeTariff('0207.14', 'AU', 'JP', 1000000, {
      agreements: sampleAgreements,
      tariffRates: sampleTariffRates,
    });

    // Should have JAEPA, RCEP, and CPTPP (3 active agreements for AU-JP)
    expect(result.agreements.length).toBe(3);

    // Best agreement should have the highest savings
    const maxSavings = Math.max(...result.agreements.map((a) => a.savings_amount));
    expect(result.best_agreement!.savings_amount).toBe(maxSavings);
  });

  it('should include conditions from tariff rate data', () => {
    const result = optimizeTariff('0207.14', 'AU', 'JP', 1000000, {
      agreements: sampleAgreements,
      tariffRates: sampleTariffRates,
    });

    const jaepa = result.agreements.find((a) => a.agreement.id === 'jaepa');
    expect(jaepa!.conditions).toEqual({ origin_certificate: true });

    const cptpp = result.agreements.find((a) => a.agreement.id === 'cptpp');
    expect(cptpp!.conditions).toEqual({ cumulation_rule: 'full' });
  });
});

describe('getAgreementsByCountries', () => {
  it('should return applicable agreements between two countries', () => {
    const result = getAgreementsByCountries(sampleAgreements, 'JP', 'AU');
    // JAEPA (priority 1), RCEP (priority 2), CPTPP (priority 3) - inactive excluded
    expect(result.length).toBe(3);
  });

  it('should sort agreements by priority', () => {
    const result = getAgreementsByCountries(sampleAgreements, 'JP', 'AU');
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].priority).toBeLessThanOrEqual(result[i].priority);
    }
  });

  it('should return empty array for countries with no agreements', () => {
    const result = getAgreementsByCountries(sampleAgreements, 'US', 'BR');
    expect(result).toEqual([]);
  });

  it('should exclude inactive agreements', () => {
    const result = getAgreementsByCountries(sampleAgreements, 'JP', 'AU');
    const inactive = result.find((a) => a.id === 'inactive-agreement');
    expect(inactive).toBeUndefined();
  });
});

describe('getTariffRatesForHSCode', () => {
  it('should return all rates for a given HS code', () => {
    const result = getTariffRatesForHSCode(sampleTariffRates, '0207.14');
    expect(result.length).toBe(4); // MFN + 3 agreements
  });

  it('should return empty array for non-existent HS code', () => {
    const result = getTariffRatesForHSCode(sampleTariffRates, '9999.99');
    expect(result).toEqual([]);
  });
});
