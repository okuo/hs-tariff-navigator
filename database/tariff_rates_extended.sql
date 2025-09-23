-- Trade Lens Extended Tariff Rates
-- 主要貿易品目の協定別関税率データ

INSERT INTO tariff_rates (hs_code, country_from, country_to, agreement_id, base_rate, preferential_rate, conditions, effective_date) VALUES

-- 半導体・電子機器（日本 → 各国）
('8542310000', 'JP', 'CN', 'rcep', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2022-01-01'),
('8542310000', 'JP', 'US', 'jusmca', 0.0, 0.0, '{"duty_free": true}', '2020-01-01'),
('8542310000', 'JP', 'AU', 'cptpp', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2018-12-30'),
('8542310000', 'JP', 'GB', 'juk-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2021-01-01'),
('8542310000', 'JP', 'DE', 'jepa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2019-02-01'),

('8517621000', 'JP', 'CN', 'rcep', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2022-01-01'),
('8517621000', 'JP', 'US', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8517621000', 'JP', 'SG', 'jsg-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2002-11-30'),
('8517621000', 'JP', 'MY', 'jmy-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2006-07-13'),

-- 自動車・輸送機器（日本 → 各国）
('8703211000', 'JP', 'AU', 'jaepa', 5.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2015-01-15'),
('8703211000', 'JP', 'NZ', 'cptpp', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2018-12-30'),
('8703211000', 'JP', 'CA', 'cptpp', 6.1, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "5年"}', '2018-12-30'),
('8703211000', 'JP', 'MX', 'cptpp', 20.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2018-12-30'),

('8703801000', 'JP', 'GB', 'juk-epa', 10.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2021-01-01'),
('8703801000', 'JP', 'DE', 'jepa', 10.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2019-02-01'),
('8703801000', 'JP', 'CN', 'rcep', 25.0, 12.5, '{"origin_requirement": "原産地証明書が必要", "staging": "15年"}', '2022-01-01'),

('8708100000', 'JP', 'TH', 'jth-epa', 30.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2007-11-01'),
('8708100000', 'JP', 'ID', 'jid-epa', 25.0, 5.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2008-07-01'),
('8708100000', 'JP', 'VN', 'jvn-epa', 50.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "15年"}', '2009-10-01'),

-- 機械・産業機器（日本 → 各国）
('8479891000', 'JP', 'CN', 'rcep', 8.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2022-01-01'),
('8479891000', 'JP', 'DE', 'jepa', 1.7, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2019-02-01'),
('8479891000', 'JP', 'US', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8479891000', 'JP', 'TH', 'jasean-epa', 5.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "5年"}', '2008-12-01'),

('8456101000', 'JP', 'GB', 'juk-epa', 3.7, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2021-01-01'),
('8456101000', 'JP', 'CH', 'jch-epa', 2.5, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2009-09-01'),
('8456101000', 'JP', 'SG', 'jsg-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2002-11-30'),

-- 化学製品（日本 → 各国）
('3901100000', 'JP', 'CN', 'rcep', 6.5, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2022-01-01'),
('3901100000', 'JP', 'US', NULL, 6.5, 6.5, '{"mfn_rate": true}', '2024-01-01'),
('3901100000', 'JP', 'DE', 'jepa', 6.5, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "7年"}', '2019-02-01'),
('3901100000', 'JP', 'TH', 'jasean-epa', 5.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2008-12-01'),

('2902200000', 'JP', 'SG', 'jsg-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2002-11-30'),
('2902200000', 'JP', 'MY', 'jmy-epa', 3.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "5年"}', '2006-07-13'),

-- 食品・農林水産物（各国 → 日本）
('0304870000', 'TH', 'JP', 'jth-epa', 3.5, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2007-11-01'),
('0304870000', 'VN', 'JP', 'jvn-epa', 3.5, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2009-10-01'),
('0304870000', 'ID', 'JP', 'jid-epa', 3.5, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2008-07-01'),

('1605210000', 'TH', 'JP', 'jasean-epa', 6.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2008-12-01'),
('1605210000', 'VN', 'JP', 'cptpp', 6.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2018-12-30'),
('1605210000', 'MY', 'JP', 'rcep', 6.0, 3.0, '{"origin_requirement": "原産地証明書が必要", "staging": "15年"}', '2022-01-01'),

('0901210000', 'AU', 'JP', 'jaepa', 6.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2015-01-15'),
('0901210000', 'PE', 'JP', 'cptpp', 6.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2018-12-30'),
('0901210000', 'VN', 'JP', 'jvn-epa', 6.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "即時撤廃"}', '2009-10-01'),

-- 繊維・衣類（各国 → 日本）
('6109100000', 'VN', 'JP', 'jvn-epa', 10.9, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2009-10-01'),
('6109100000', 'MY', 'JP', 'jmy-epa', 10.9, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2006-07-13'),
('6109100000', 'PH', 'JP', 'jph-epa', 10.9, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2008-12-11'),

('6203120000', 'IT', 'JP', 'jepa', 9.1, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2019-02-01'),
('6203120000', 'GB', 'JP', 'juk-epa', 9.1, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2021-01-01'),

-- 金属・材料（各国 → 日本）
('7208100000', 'AU', 'JP', 'jaepa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2015-01-15'),
('7208100000', 'CA', 'JP', 'cptpp', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2018-12-30'),
('7208100000', 'CL', 'JP', 'jcl-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2007-09-03'),

('7601100000', 'AU', 'JP', 'jaepa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "原産地証明書が必要"}', '2015-01-15'),
('7601100000', 'MY', 'JP', 'rcep', 3.0, 0.0, '{"origin_requirement": "原産地証明書が必要", "staging": "10年"}', '2022-01-01'),

-- MFN（最恵国）税率（協定なし）
('8542310000', 'JP', 'KR', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8542310000', 'JP', 'TW', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8517621000', 'JP', 'IN', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8703211000', 'JP', 'KR', NULL, 8.0, 8.0, '{"mfn_rate": true}', '2024-01-01'),
('8703211000', 'JP', 'TW', NULL, 17.5, 17.5, '{"mfn_rate": true}', '2024-01-01'),
('8479891000', 'JP', 'IN', NULL, 7.5, 7.5, '{"mfn_rate": true}', '2024-01-01'),
('3901100000', 'JP', 'BR', NULL, 14.0, 14.0, '{"mfn_rate": true}', '2024-01-01');