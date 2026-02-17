# HS Tariff Navigator 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

HS Tariff Navigator縺ｮ菴ｿ逕ｨ荳ｭ縺ｫ逋ｺ逕溘☆繧句庄閭ｽ諤ｧ縺後≠繧句撫鬘後→隗｣豎ｺ譁ｹ豕輔ｒ縺ｾ縺ｨ繧√∪縺励◆縲・
## 圷 繧医￥縺ゅｋ蝠城｡後→隗｣豎ｺ譁ｹ豕・
### Chrome諡｡蠑ｵ讖溯・髢｢騾｣

#### 笶・諡｡蠑ｵ讖溯・縺瑚ｪｭ縺ｿ霎ｼ繧√↑縺・
**逞・憾**: Chrome諡｡蠑ｵ讖溯・縺ｮ隱ｭ縺ｿ霎ｼ縺ｿ譎ゅ↓繧ｨ繝ｩ繝ｼ縺檎匱逕溘☆繧・
**蜴溷屏縺ｨ隗｣豎ｺ遲・*:

1. **manifest.json繧ｨ繝ｩ繝ｼ**
   ```bash
   # manifest.json縺ｮ讒区枚遒ｺ隱・   cat public/manifest.json | python -m json.tool
   ```

2. **繝薙Ν繝峨お繝ｩ繝ｼ**
   ```bash
   # 繝励Ο繧ｸ繧ｧ繧ｯ繝医・蜀阪ン繝ｫ繝・   npm run clean
   npm run build
   ```

3. **讓ｩ髯蝉ｸ崎ｶｳ**
   - Chrome諡｡蠑ｵ讖溯・邂｡逅・判髱｢縺ｧ縲後ョ繝吶Ο繝・ヱ繝ｼ繝｢繝ｼ繝峨阪′譛牙柑縺狗｢ｺ隱・   - `dist`繝輔か繝ｫ繝繧呈ｭ｣縺励￥驕ｸ謚槭＠縺ｦ縺・ｋ縺狗｢ｺ隱・
#### 笶・繝昴ャ繝励い繝・・縺瑚｡ｨ遉ｺ縺輔ｌ縺ｪ縺・
**逞・憾**: 諡｡蠑ｵ讖溯・繧｢繧､繧ｳ繝ｳ繧偵け繝ｪ繝・け縺励※繧ゅ・繝・・繧｢繝・・縺碁幕縺九↑縺・
**隗｣豎ｺ遲・*:
1. **諡｡蠑ｵ讖溯・縺ｮ蜀崎ｪｭ縺ｿ霎ｼ縺ｿ**
   - `chrome://extensions/` 縺ｧ HS Tariff Navigator 縺ｮ縲梧峩譁ｰ縲阪・繧ｿ繝ｳ繧偵け繝ｪ繝・け

2. **DevTools縺ｧ繧ｨ繝ｩ繝ｼ遒ｺ隱・*
   - 諡｡蠑ｵ讖溯・繧｢繧､繧ｳ繝ｳ繧貞承繧ｯ繝ｪ繝・け 竊・縲梧､懆ｨｼ縲・   - Console 繧ｿ繝悶〒繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ繧堤｢ｺ隱・
3. **繝輔ぃ繧､繝ｫ讓ｩ髯千｢ｺ隱・*
   ```bash
   # dist繝輔か繝ｫ繝縺ｮ讓ｩ髯千｢ｺ隱・   ls -la dist/
   # popup.html縺悟ｭ伜惠縺吶ｋ縺狗｢ｺ隱・   ls -la dist/popup.html
   ```

#### 笶・Service Worker 繧ｨ繝ｩ繝ｼ

**逞・憾**: 繝舌ャ繧ｯ繧ｰ繝ｩ繧ｦ繝ｳ繝牙・逅・′蜍穂ｽ懊＠縺ｪ縺・
**隗｣豎ｺ遲・*:
1. **Service Worker縺ｮ迥ｶ諷狗｢ｺ隱・*
   - `chrome://extensions/` 縺ｧ縲後し繝ｼ繝薙せ繝ｯ繝ｼ繧ｫ繝ｼ縲阪ｒ繧ｯ繝ｪ繝・け
   - 繧ｨ繝ｩ繝ｼ繝ｭ繧ｰ繧堤｢ｺ隱・
2. **Manifest V3貅匁侠繝√ぉ繝・け**
   ```json
   // public/manifest.json 縺ｧ遒ｺ隱・   {
     "manifest_version": 3,
     "background": {
       "service_worker": "background.js"
     }
   }
   ```

### Supabase謗･邯夐未騾｣

#### 笶・繝・・繧ｿ繝吶・繧ｹ謗･邯壹お繝ｩ繝ｼ

**逞・憾**: 縲郡upabase client initialization failed縲・
**隗｣豎ｺ遲・*:

1. **迺ｰ蠅・､画焚縺ｮ遒ｺ隱・*
   ```bash
   # .env繝輔ぃ繧､繝ｫ縺ｮ蜀・ｮｹ遒ｺ隱・   cat .env
   ```
   
   蠢・ｦ√↑險ｭ螳・
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

2. **Supabase繝励Ο繧ｸ繧ｧ繧ｯ繝医・迥ｶ諷狗｢ｺ隱・*
   - [Supabase Dashboard](https://supabase.com/dashboard) 縺ｧ繝励Ο繧ｸ繧ｧ繧ｯ繝医′縲窟ctive縲咲憾諷九°遒ｺ隱・   - 縲郡ettings縲坂・縲窟PI縲阪〒URL縺ｨ繧ｭ繝ｼ縺梧ｭ｣縺励＞縺狗｢ｺ隱・
3. **繝阪ャ繝医Ρ繝ｼ繧ｯ繧｢繧ｯ繧ｻ繧ｹ遒ｺ隱・*
   ```javascript
   // DevTools縺ｮNetwork繧ｿ繝悶〒Supabase縺ｸ縺ｮ繝ｪ繧ｯ繧ｨ繧ｹ繝医ｒ遒ｺ隱・   // CORS 繧ｨ繝ｩ繝ｼ縺後↑縺・°繝√ぉ繝・け
   ```

#### 笶・RPC髢｢謨ｰ繧ｨ繝ｩ繝ｼ

**逞・憾**: 縲掲unction search_hs_codes(text, integer) does not exist縲・
**隗｣豎ｺ遲・*:
1. **繝・・繧ｿ繝吶・繧ｹ髢｢謨ｰ縺ｮ遒ｺ隱・*
   ```sql
   -- Supabase SQL Editor縺ｧ螳溯｡・   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_type = 'FUNCTION';
   ```

2. **髢｢謨ｰ縺ｮ蜀堺ｽ懈・**
   - `database/functions.sql` 縺ｮ蜀・ｮｹ繧貞・螳溯｡・   - pg_trgm諡｡蠑ｵ縺梧怏蜉ｹ蛹悶＆繧後※縺・ｋ縺狗｢ｺ隱・
#### 笶・Row Level Security 繧ｨ繝ｩ繝ｼ

**逞・憾**: 縲系ew row violates row-level security policy縲・
**隗｣豎ｺ遲・*:
1. **RLS繝昴Μ繧ｷ繝ｼ縺ｮ遒ｺ隱・*
   ```sql
   -- 繝昴Μ繧ｷ繝ｼ荳隕ｧ遒ｺ隱・   SELECT tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies;
   ```

2. **繧ｻ繧ｭ繝･繝ｪ繝・ぅ繝昴Μ繧ｷ繝ｼ縺ｮ蜀崎ｨｭ螳・*
   - `database/security.sql` 縺ｮ蜀・ｮｹ繧貞・螳溯｡・
### 繝・・繧ｿ讀懃ｴ｢髢｢騾｣

#### 笶・HS繧ｳ繝ｼ繝画､懃ｴ｢邨先棡縺瑚｡ｨ遉ｺ縺輔ｌ縺ｪ縺・
**逞・憾**: 讀懃ｴ｢縺励※繧ゅ檎ｵ先棡縺後≠繧翫∪縺帙ｓ縲阪→陦ｨ遉ｺ縺輔ｌ繧・
**隗｣豎ｺ遲・*:

1. **繝・・繧ｿ蟄伜惠遒ｺ隱・*
   ```sql
   -- Supabase SQL Editor縺ｧ螳溯｡・   SELECT COUNT(*) FROM hs_codes;
   SELECT * FROM hs_codes LIMIT 5;
   ```

2. **讀懃ｴ｢髢｢謨ｰ縺ｮ繝・せ繝・*
   ```sql
   -- 逶ｴ謗･讀懃ｴ｢髢｢謨ｰ繧偵ユ繧ｹ繝・   SELECT * FROM search_hs_codes('髮ｻ豎', 5);
   ```

3. **譁・ｭ励お繝ｳ繧ｳ繝ｼ繝・ぅ繝ｳ繧ｰ遒ｺ隱・*
   - 譌･譛ｬ隱樊､懃ｴ｢繧ｭ繝ｼ繝ｯ繝ｼ繝峨′豁｣縺励￥騾∽ｿ｡縺輔ｌ縺ｦ縺・ｋ縺九ロ繝・ヨ繝ｯ繝ｼ繧ｯ繧ｿ繝悶〒遒ｺ隱・
#### 笶・髢｢遞取怙驕ｩ蛹悶′蜍穂ｽ懊＠縺ｪ縺・
**逞・憾**: 縲梧怙驕ｩ蛹悶ｒ螳溯｡後阪ｒ繧ｯ繝ｪ繝・け縺励※繧らｵ先棡縺瑚｡ｨ遉ｺ縺輔ｌ縺ｪ縺・
**隗｣豎ｺ遲・*:

1. **髢｢遞守紫繝・・繧ｿ縺ｮ遒ｺ隱・*
   ```sql
   -- 髢｢遞守紫繝・・繧ｿ縺ｮ蟄伜惠遒ｺ隱・   SELECT COUNT(*) FROM tariff_rates;
   SELECT * FROM tariff_rates 
   WHERE hs_code = '8507100000' 
     AND country_from = 'JP' 
     AND country_to = 'CN';
   ```

2. **蜊泌ｮ壹ョ繝ｼ繧ｿ縺ｮ遒ｺ隱・*
   ```sql
   -- 蜊泌ｮ壹ョ繝ｼ繧ｿ縺ｮ遒ｺ隱・   SELECT * FROM agreements WHERE is_active = true;
   ```

3. **譛驕ｩ蛹夜未謨ｰ縺ｮ繝・せ繝・*
   ```sql
   -- 逶ｴ謗･譛驕ｩ蛹夜未謨ｰ繧偵ユ繧ｹ繝・   SELECT optimize_tariff('8507100000', 'JP', 'CN', 1000000);
   ```

### 繝薙Ν繝峨・髢狗匱髢｢騾｣

#### 笶・TypeScript繧ｳ繝ｳ繝代う繝ｫ繧ｨ繝ｩ繝ｼ

**逞・憾**: `npm run build` 譎ゅ↓TypeScript繧ｨ繝ｩ繝ｼ

**隗｣豎ｺ遲・*:

1. **蝙句ｮ夂ｾｩ縺ｮ遒ｺ隱・*
   ```bash
   # TypeScript蝙九メ繧ｧ繝・け
   npm run typecheck
   ```

2. **蝙句ｮ夂ｾｩ繝輔ぃ繧､繝ｫ縺ｮ譖ｴ譁ｰ**
   ```typescript
   // src/types/database.ts 縺梧怙譁ｰ縺ｮ繧ｹ繧ｭ繝ｼ繝槭→荳閾ｴ縺励※縺・ｋ縺狗｢ｺ隱・   ```

3. **萓晏ｭ倬未菫ゅ・蜀阪う繝ｳ繧ｹ繝医・繝ｫ**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### 笶・Webpack 繝薙Ν繝峨お繝ｩ繝ｼ

**逞・憾**: 繝薙Ν繝画凾縺ｫ縲勲odule not found縲阪お繝ｩ繝ｼ

**隗｣豎ｺ遲・*:

1. **繝代せ險ｭ螳壹・遒ｺ隱・*
   ```javascript
   // webpack.config.js 縺ｮalias險ｭ螳壹ｒ遒ｺ隱・   resolve: {
     alias: {
       '@': path.resolve(__dirname, 'src'),
     }
   }
   ```

2. **繝輔ぃ繧､繝ｫ蟄伜惠遒ｺ隱・*
   ```bash
   # 繧､繝ｳ繝昴・繝医＠縺ｦ縺・ｋ繝輔ぃ繧､繝ｫ縺悟ｭ伜惠縺吶ｋ縺狗｢ｺ隱・   find src/ -name "*.ts" -o -name "*.tsx"
   ```

### 繝代ヵ繧ｩ繝ｼ繝槭Φ繧ｹ髢｢騾｣

#### 笶・諡｡蠑ｵ讖溯・縺碁㍾縺・・驕・＞

**逞・憾**: 繝昴ャ繝励い繝・・縺ｮ陦ｨ遉ｺ繧・､懃ｴ｢縺碁≦縺・
**隗｣豎ｺ遲・*:

1. **繝舌Φ繝峨Ν繧ｵ繧､繧ｺ縺ｮ遒ｺ隱・*
   ```bash
   # 繝薙Ν繝峨ヵ繧｡繧､繝ｫ繧ｵ繧､繧ｺ縺ｮ遒ｺ隱・   ls -lah dist/
   ```

2. **荳崎ｦ√↑萓晏ｭ倬未菫ゅ・蜑企勁**
   ```bash
   # 譛ｪ菴ｿ逕ｨ縺ｮ萓晏ｭ倬未菫ゅｒ繝√ぉ繝・け
   npx depcheck
   ```

3. **繧ｭ繝｣繝・す繝･縺ｮ繧ｯ繝ｪ繧｢**
   ```javascript
   // DevTools縺ｧ繧ｹ繝医Ξ繝ｼ繧ｸ繧偵け繝ｪ繧｢
   chrome.storage.local.clear();
   ```

## 肌 繝・ヰ繝・げ謇矩・
### 1. 繝ｭ繧ｰ繝ｬ繝吶Ν縺ｮ險ｭ螳・
```typescript
// src/utils/logger.ts
const LOG_LEVEL = process.env.VITE_LOG_LEVEL || 'info';

export function debugLog(message: string, data?: any) {
  if (LOG_LEVEL === 'development') {
    console.log('[HS Tariff Navigator Debug]', message, data);
  }
}
```

### 2. DevTools縺ｮ豢ｻ逕ｨ

#### 繝昴ャ繝励い繝・・縺ｮ繝・ヰ繝・げ
1. 諡｡蠑ｵ讖溯・繧｢繧､繧ｳ繝ｳ繧貞承繧ｯ繝ｪ繝・け 竊・縲梧､懆ｨｼ縲・2. Elements, Console, Network, Application 繧ｿ繝悶ｒ菴ｿ逕ｨ

#### Service Worker縺ｮ繝・ヰ繝・げ
1. `chrome://extensions/` 竊・縲後し繝ｼ繝薙せ繝ｯ繝ｼ繧ｫ繝ｼ縲阪ｒ繧ｯ繝ｪ繝・け
2. DevTools縺ｧ繝舌ャ繧ｯ繧ｰ繝ｩ繧ｦ繝ｳ繝牙・逅・ｒ逶｣隕・
#### 繧ｹ繝医Ξ繝ｼ繧ｸ縺ｮ遒ｺ隱・```javascript
// DevTools Console 縺ｧ螳溯｡・chrome.storage.local.get(null, console.log);
chrome.storage.local.clear(); // 繧ｯ繝ｪ繧｢
```

### 3. 繝阪ャ繝医Ρ繝ｼ繧ｯ騾壻ｿ｡縺ｮ逶｣隕・
```javascript
// fetch騾壻ｿ｡縺ｮ繝ｭ繧ｰ蜃ｺ蜉・const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch:', args);
  return originalFetch.apply(this, args);
};
```

## 到 繧ｵ繝昴・繝域ュ蝣ｱ

### 繧ｨ繝ｩ繝ｼ繝ｬ繝昴・繝域凾縺ｮ諠・ｱ蜿朱寔

蝠城｡悟ｱ蜻頑凾縺ｯ莉･荳九・諠・ｱ繧貞性繧√※縺上□縺輔＞・・
1. **迺ｰ蠅・ュ蝣ｱ**
   - OS: Windows/Mac/Linux
   - Chrome 繝舌・繧ｸ繝ｧ繝ｳ
   - HS Tariff Navigator 繝舌・繧ｸ繝ｧ繝ｳ

2. **繧ｨ繝ｩ繝ｼ諠・ｱ**
   - 繧ｨ繝ｩ繝ｼ繝｡繝・そ繝ｼ繧ｸ縺ｮ蜈ｨ譁・   - DevTools縺ｮConsole繝ｭ繧ｰ
   - 蜀咲樟謇矩・
3. **險ｭ螳壽ュ蝣ｱ**
   ```bash
   # .env繝輔ぃ繧､繝ｫ縺ｮ蜀・ｮｹ・育ｧ伜ｯ・ュ蝣ｱ縺ｯ莨上○繧具ｼ・   VITE_SUPABASE_URL=https://*****.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci***** (荳驛ｨ)
   ```

### 繧医￥縺ゅｋ險ｭ螳壹Α繧ｹ

#### 笶・迺ｰ蠅・､画焚縺ｮ險ｭ螳壹Α繧ｹ
```bash
# 髢馴＆縺・ｾ・SUPABASE_URL=...          # VITE_ 繝励Ξ繝輔ぅ繝・け繧ｹ縺後↑縺・VITE_SUPABASE_URL=http... # HTTPS縺ｧ縺ｯ縺ｪ縺秋TTP
```

#### 笶・Supabase繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｨｭ螳壹Α繧ｹ
- 繝励Ο繧ｸ繧ｧ繧ｯ繝医′荳譎ょ●豁｢迥ｶ諷・- API 繧ｭ繝ｼ縺梧ｭ｣縺励￥繧ｳ繝斐・縺輔ｌ縺ｦ縺・↑縺・- 蝨ｰ蝓溯ｨｭ螳壹′逡ｰ縺ｪ繧・
### 繧ｻ繝ｫ繝輔メ繧ｧ繝・け繝ｪ繧ｹ繝・
蝠城｡檎匱逕滓凾縺ｯ莉･荳九ｒ繝√ぉ繝・け・・
- [ ] Chrome諡｡蠑ｵ讖溯・縺梧怙譁ｰ縺ｮdist繝輔か繝ｫ繝繧定ｪｭ縺ｿ霎ｼ繧薙〒縺・ｋ
- [ ] .env繝輔ぃ繧､繝ｫ縺梧ｭ｣縺励￥險ｭ螳壹＆繧後※縺・ｋ  
- [ ] Supabase繝励Ο繧ｸ繧ｧ繧ｯ繝医′繧｢繧ｯ繝・ぅ繝也憾諷・- [ ] 蠢・ｦ√↑繝・・繧ｿ繝吶・繧ｹ繝・・繝悶Ν縺ｨ髢｢謨ｰ縺悟ｭ伜惠縺吶ｋ
- [ ] 繧､繝ｳ繧ｿ繝ｼ繝阪ャ繝域磁邯壹′豁｣蟶ｸ
- [ ] DevTools縺ｧJavaScript繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｦ縺・↑縺・
## ・ 縺輔ｉ縺ｪ繧九し繝昴・繝・
荳願ｨ倥〒隗｣豎ｺ縺励↑縺・ｴ蜷茨ｼ・
1. **GitHub繧､繧ｷ繝･繝ｼ**: [Issues](../../issues) 縺ｧ譁ｰ縺励＞蝠城｡後ｒ蝣ｱ蜻・2. **繝・ぅ繧ｹ繧ｫ繝・す繝ｧ繝ｳ**: [Discussions](../../discussions) 縺ｧ繧ｳ繝溘Η繝九ユ繧｣縺ｫ逶ｸ隲・3. **繝峨く繝･繝｡繝ｳ繝・*: [README.md](../README.md) 縺ｧ蝓ｺ譛ｬ諠・ｱ繧貞・遒ｺ隱・
---

**蝠城｡後′隗｣豎ｺ縺励◆繧峨∝酔縺伜撫鬘後〒蝗ｰ縺｣縺ｦ縺・ｋ莉悶・繝ｦ繝ｼ繧ｶ繝ｼ縺ｮ縺溘ａ縺ｫ繧ｽ繝ｪ繝･繝ｼ繧ｷ繝ｧ繝ｳ繧偵す繧ｧ繧｢縺励※縺・◆縺縺代ｋ縺ｨ蟷ｸ縺・〒縺呻ｼ・*
