# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 繝励Ο繧ｸ繧ｧ繧ｯ繝域ｦりｦ・
縲卦rade Lens縲阪・譌･譛ｬ莨∵･ｭ縺ｮ雋ｿ譏薙さ繧ｹ繝亥炎貂帙ｒ謾ｯ謠ｴ縺吶ｋChrome諡｡蠑ｵ讖溯・縺ｧ縺吶・S繧ｳ繝ｼ繝画､懃ｴ｢縺ｨFTA/EPA蜊泌ｮ壹・譛驕ｩ縺ｪ髢｢遞守紫繧定・蜍募愛螳壹＠縲∝炎貂幃｡阪ｒ繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ縺励∪縺吶・
### 荳ｻ隕∵ｩ溯・
- HS繧ｳ繝ｼ繝画､懃ｴ｢・・8蜩∫岼蜿朱鹸・・- FTA/EPA髢｢遞取怙驕ｩ蛹厄ｼ・0蜊泌ｮ壼ｯｾ蠢懶ｼ・- 蜑頑ｸ幃｡阪す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ
- 讀懃ｴ｢螻･豁ｴ邂｡逅・
### 謚陦薙せ繧ｿ繝・け
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Build**: Webpack 5
- **Extension**: Chrome Manifest V3

## 髢狗匱繧ｳ繝槭Φ繝・
### 蝓ｺ譛ｬ繧ｳ繝槭Φ繝・```bash
# 萓晏ｭ倬未菫ゅう繝ｳ繧ｹ繝医・繝ｫ
npm install

# 髢狗匱繝薙Ν繝会ｼ医ヵ繧｡繧､繝ｫ逶｣隕厄ｼ・npm run dev

# 譛ｬ逡ｪ繝薙Ν繝・npm run build

# 蝙九メ繧ｧ繝・け
npm run type-check

# 諡｡蠑ｵ讖溯・繝代ャ繧ｱ繝ｼ繧ｸ蛹・npm run pack
```

### Chrome諡｡蠑ｵ讖溯・縺ｮ隱ｭ縺ｿ霎ｼ縺ｿ
1. Chrome 縺ｧ `chrome://extensions/` 繧帝幕縺・2. 縲後ョ繝吶Ο繝・ヱ繝ｼ繝｢繝ｼ繝峨阪ｒ譛牙柑蛹・3. 縲後ヱ繝・こ繝ｼ繧ｸ蛹悶＆繧後※縺・↑縺・僑蠑ｵ讖溯・繧定ｪｭ縺ｿ霎ｼ繧縲阪〒 `dist` 繝輔か繝ｫ繝繧帝∈謚・
## 繝・・繧ｿ繝吶・繧ｹ繧ｻ繝・ヨ繧｢繝・・

### Supabase險ｭ螳・```bash
# 迺ｰ蠅・､画焚險ｭ螳・cp .env.example .env
# .env 繧堤ｷｨ髮・＠縺ｦSupabase隱崎ｨｼ諠・ｱ繧定ｨｭ螳・```

### 繝・・繧ｿ繝吶・繧ｹ蛻晄悄蛹・Supabase SQL Editor縺ｧ莉･荳九ｒ鬆・ｬ｡螳溯｡鯉ｼ・```bash
database/schema.sql      # 繧ｹ繧ｭ繝ｼ繝槭・繧､繝ｳ繝・ャ繧ｯ繧ｹ
database/security.sql    # RLS繝昴Μ繧ｷ繝ｼ  
database/functions.sql   # 繧ｹ繝医い繝峨ヵ繧｡繝ｳ繧ｯ繧ｷ繝ｧ繝ｳ
database/sample_data.sql # 蝓ｺ譛ｬ繝・・繧ｿ

# 諡｡蠑ｵ繝・・繧ｿ・医が繝励す繝ｧ繝ｳ・・database/hs_codes_extended.sql
database/agreements_extended.sql
database/tariff_rates_extended.sql
```

## 繝励Ο繧ｸ繧ｧ繧ｯ繝域ｧ矩

Chrome諡｡蠑ｵ讖溯・縺ｮ蝓ｺ譛ｬ讒矩・・
```
/
笏懌楳笏 manifest.json          # 諡｡蠑ｵ讖溯・縺ｮ險ｭ螳壹ヵ繧｡繧､繝ｫ
笏懌楳笏 popup/                 # 繝昴ャ繝励い繝・・UI
笏・  笏懌楳笏 popup.html
笏・  笏懌楳笏 popup.js
笏・  笏披楳笏 popup.css
笏懌楳笏 content/               # 繧ｳ繝ｳ繝・Φ繝・せ繧ｯ繝ｪ繝励ヨ
笏・  笏披楳笏 content.js
笏懌楳笏 background/            # 繝舌ャ繧ｯ繧ｰ繝ｩ繧ｦ繝ｳ繝峨せ繧ｯ繝ｪ繝励ヨ
笏・  笏披楳笏 background.js
笏懌楳笏 options/               # 繧ｪ繝励す繝ｧ繝ｳ繝壹・繧ｸ
笏・  笏懌楳笏 options.html
笏・  笏披楳笏 options.js
笏披楳笏 assets/               # 繧｢繧､繧ｳ繝ｳ繧・判蜒・    笏懌楳笏 icon16.png
    笏懌楳笏 icon48.png
    笏披楳笏 icon128.png
```

## 驥崎ｦ√↑髢狗匱繝昴う繝ｳ繝・
### manifest.json險ｭ螳・- Manifest V3繧剃ｽｿ逕ｨ
- 蠢・ｦ√↑讓ｩ髯撰ｼ・ermissions・峨・譛蟆丞喧
- host_permissions縺ｧ繧｢繧ｯ繧ｻ繧ｹ蜿ｯ閭ｽ縺ｪ繧ｵ繧､繝医ｒ蛻ｶ髯・
### 繧ｳ繝ｳ繝・Φ繝・せ繧ｯ繝ｪ繝励ヨ
- 繧ｦ繧ｧ繝悶・繝ｼ繧ｸ縺ｮDOM縺ｫ逶ｴ謗･繧｢繧ｯ繧ｻ繧ｹ
- 繝壹・繧ｸ縺ｮ雋ｿ譏馴未騾｣繝・・繧ｿ繧呈歓蜃ｺ繝ｻ蛻・梵

### 繝昴ャ繝励い繝・・
- 繝ｦ繝ｼ繧ｶ繝ｼ繧､繝ｳ繧ｿ繝ｼ繝輔ぉ繝ｼ繧ｹ縺ｮ荳ｻ隕・Κ蛻・- 蛻・梵邨先棡縺ｮ陦ｨ遉ｺ縺ｨ繝ｦ繝ｼ繧ｶ繝ｼ謫堺ｽ・
### 繝舌ャ繧ｯ繧ｰ繝ｩ繧ｦ繝ｳ繝峨せ繧ｯ繝ｪ繝励ヨ
- 繝・・繧ｿ縺ｮ豌ｸ邯壼喧
- API騾壻ｿ｡繧・け繝ｭ繧ｹ繧ｿ繝匁ｩ溯・

## 繝・ヰ繝・げ譁ｹ豕・
- Chrome DevTools 縺ｧ繝昴ャ繝励い繝・・縺ｮ繝・ヰ繝・げ
- 繧ｳ繝ｳ繝・Φ繝・せ繧ｯ繝ｪ繝励ヨ縺ｯ繝壹・繧ｸ縺ｮDevTools縺ｧ繝・ヰ繝・げ
- 繝舌ャ繧ｯ繧ｰ繝ｩ繧ｦ繝ｳ繝峨せ繧ｯ繝ｪ繝励ヨ縺ｯ chrome://extensions/ 縺ｮ縲後し繝ｼ繝薙せ繝ｯ繝ｼ繧ｫ繝ｼ縲阪°繧峨ョ繝舌ャ繧ｰ
