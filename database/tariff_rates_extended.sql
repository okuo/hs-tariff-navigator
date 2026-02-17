-- HS Tariff Navigator Extended Tariff Rates
-- 荳ｻ隕∬ｲｿ譏灘刀逶ｮ縺ｮ蜊泌ｮ壼挨髢｢遞守紫繝・・繧ｿ

INSERT INTO tariff_rates (hs_code, country_from, country_to, agreement_id, base_rate, preferential_rate, conditions, effective_date) VALUES

-- 蜊雁ｰ惹ｽ薙・髮ｻ蟄先ｩ溷勣・域律譛ｬ 竊・蜷・嵜・・('8542310000', 'JP', 'CN', 'rcep', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2022-01-01'),
('8542310000', 'JP', 'US', 'jusmca', 0.0, 0.0, '{"duty_free": true}', '2020-01-01'),
('8542310000', 'JP', 'AU', 'cptpp', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2018-12-30'),
('8542310000', 'JP', 'GB', 'juk-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2021-01-01'),
('8542310000', 'JP', 'DE', 'jepa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2019-02-01'),

('8517621000', 'JP', 'CN', 'rcep', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2022-01-01'),
('8517621000', 'JP', 'US', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8517621000', 'JP', 'SG', 'jsg-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2002-11-30'),
('8517621000', 'JP', 'MY', 'jmy-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2006-07-13'),

-- 閾ｪ蜍戊ｻ翫・霈ｸ騾∵ｩ溷勣・域律譛ｬ 竊・蜷・嵜・・('8703211000', 'JP', 'AU', 'jaepa', 5.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2015-01-15'),
('8703211000', 'JP', 'NZ', 'cptpp', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2018-12-30'),
('8703211000', 'JP', 'CA', 'cptpp', 6.1, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "5蟷ｴ"}', '2018-12-30'),
('8703211000', 'JP', 'MX', 'cptpp', 20.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2018-12-30'),

('8703801000', 'JP', 'GB', 'juk-epa', 10.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2021-01-01'),
('8703801000', 'JP', 'DE', 'jepa', 10.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2019-02-01'),
('8703801000', 'JP', 'CN', 'rcep', 25.0, 12.5, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "15蟷ｴ"}', '2022-01-01'),

('8708100000', 'JP', 'TH', 'jth-epa', 30.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2007-11-01'),
('8708100000', 'JP', 'ID', 'jid-epa', 25.0, 5.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2008-07-01'),
('8708100000', 'JP', 'VN', 'jvn-epa', 50.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "15蟷ｴ"}', '2009-10-01'),

-- 讖滓｢ｰ繝ｻ逕｣讌ｭ讖溷勣・域律譛ｬ 竊・蜷・嵜・・('8479891000', 'JP', 'CN', 'rcep', 8.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2022-01-01'),
('8479891000', 'JP', 'DE', 'jepa', 1.7, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2019-02-01'),
('8479891000', 'JP', 'US', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8479891000', 'JP', 'TH', 'jasean-epa', 5.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "5蟷ｴ"}', '2008-12-01'),

('8456101000', 'JP', 'GB', 'juk-epa', 3.7, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2021-01-01'),
('8456101000', 'JP', 'CH', 'jch-epa', 2.5, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2009-09-01'),
('8456101000', 'JP', 'SG', 'jsg-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2002-11-30'),

-- 蛹門ｭｦ陬ｽ蜩・ｼ域律譛ｬ 竊・蜷・嵜・・('3901100000', 'JP', 'CN', 'rcep', 6.5, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2022-01-01'),
('3901100000', 'JP', 'US', NULL, 6.5, 6.5, '{"mfn_rate": true}', '2024-01-01'),
('3901100000', 'JP', 'DE', 'jepa', 6.5, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "7蟷ｴ"}', '2019-02-01'),
('3901100000', 'JP', 'TH', 'jasean-epa', 5.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2008-12-01'),

('2902200000', 'JP', 'SG', 'jsg-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2002-11-30'),
('2902200000', 'JP', 'MY', 'jmy-epa', 3.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "5蟷ｴ"}', '2006-07-13'),

-- 鬟溷刀繝ｻ霎ｲ譫玲ｰｴ逕｣迚ｩ・亥推蝗ｽ 竊・譌･譛ｬ・・('0304870000', 'TH', 'JP', 'jth-epa', 3.5, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2007-11-01'),
('0304870000', 'VN', 'JP', 'jvn-epa', 3.5, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2009-10-01'),
('0304870000', 'ID', 'JP', 'jid-epa', 3.5, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2008-07-01'),

('1605210000', 'TH', 'JP', 'jasean-epa', 6.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2008-12-01'),
('1605210000', 'VN', 'JP', 'cptpp', 6.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2018-12-30'),
('1605210000', 'MY', 'JP', 'rcep', 6.0, 3.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "15蟷ｴ"}', '2022-01-01'),

('0901210000', 'AU', 'JP', 'jaepa', 6.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2015-01-15'),
('0901210000', 'PE', 'JP', 'cptpp', 6.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2018-12-30'),
('0901210000', 'VN', 'JP', 'jvn-epa', 6.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "蜊ｳ譎よ彫蟒・}', '2009-10-01'),

-- 郢顔ｶｭ繝ｻ陦｣鬘橸ｼ亥推蝗ｽ 竊・譌･譛ｬ・・('6109100000', 'VN', 'JP', 'jvn-epa', 10.9, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2009-10-01'),
('6109100000', 'MY', 'JP', 'jmy-epa', 10.9, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2006-07-13'),
('6109100000', 'PH', 'JP', 'jph-epa', 10.9, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2008-12-11'),

('6203120000', 'IT', 'JP', 'jepa', 9.1, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2019-02-01'),
('6203120000', 'GB', 'JP', 'juk-epa', 9.1, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2021-01-01'),

-- 驥大ｱ槭・譚先侭・亥推蝗ｽ 竊・譌･譛ｬ・・('7208100000', 'AU', 'JP', 'jaepa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2015-01-15'),
('7208100000', 'CA', 'JP', 'cptpp', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2018-12-30'),
('7208100000', 'CL', 'JP', 'jcl-epa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2007-09-03'),

('7601100000', 'AU', 'JP', 'jaepa', 0.0, 0.0, '{"duty_free": true, "origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・}', '2015-01-15'),
('7601100000', 'MY', 'JP', 'rcep', 3.0, 0.0, '{"origin_requirement": "蜴溽肇蝨ｰ險ｼ譏取嶌縺悟ｿ・ｦ・, "staging": "10蟷ｴ"}', '2022-01-01'),

-- MFN・域怙諱ｵ蝗ｽ・臥ｨ守紫・亥鵠螳壹↑縺暦ｼ・('8542310000', 'JP', 'KR', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8542310000', 'JP', 'TW', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8517621000', 'JP', 'IN', NULL, 0.0, 0.0, '{"duty_free": true}', '2024-01-01'),
('8703211000', 'JP', 'KR', NULL, 8.0, 8.0, '{"mfn_rate": true}', '2024-01-01'),
('8703211000', 'JP', 'TW', NULL, 17.5, 17.5, '{"mfn_rate": true}', '2024-01-01'),
('8479891000', 'JP', 'IN', NULL, 7.5, 7.5, '{"mfn_rate": true}', '2024-01-01'),
('3901100000', 'JP', 'BR', NULL, 14.0, 14.0, '{"mfn_rate": true}', '2024-01-01');
