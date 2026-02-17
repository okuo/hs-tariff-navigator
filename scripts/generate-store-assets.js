#!/usr/bin/env node

/**
 * Chrome Web Store 用アイコン・スクリーンショット生成スクリプト
 * puppeteer で HTML を描画し、PNG に変換する
 */

const puppeteer = require('puppeteer');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..', 'store-assets');

// ── アイコン HTML ──────────────────────────────────────
function iconHtml(size) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center;
       background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #4f46e5 100%); }
.icon { display:flex; flex-direction:column; align-items:center; justify-content:center; }
.circle { width:${size * 0.7}px; height:${size * 0.7}px; background: rgba(255,255,255,0.15);
           border-radius:50%; display:flex; align-items:center; justify-content:center; }
.inner { font-size:${size * 0.32}px; color:#fff; font-weight:900; font-family:'Segoe UI',Arial,sans-serif;
         text-shadow: 0 ${size * 0.02}px ${size * 0.04}px rgba(0,0,0,0.2); letter-spacing:-${size * 0.015}px; }
.sub { font-size:${size * 0.09}px; color:rgba(255,255,255,0.9); font-weight:600;
       font-family:'Segoe UI',Arial,sans-serif; margin-top:${size * 0.02}px; letter-spacing:${size * 0.01}px; }
</style></head><body>
<div class="icon">
  <div class="circle"><span class="inner">TS</span></div>
  <span class="sub">TariffScope</span>
</div>
</body></html>`;
}

// ── スクリーンショット1: 検索画面 ──────────────────────
const screenshotSearch = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1280px; height:800px; background:#f1f5f9; font-family:'Segoe UI','Noto Sans JP',sans-serif; display:flex; align-items:center; justify-content:center; }
.browser { width:1200px; height:720px; background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.12); overflow:hidden; }
.toolbar { height:48px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; padding:0 16px; gap:8px; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot-r { background:#ef4444; } .dot-y { background:#eab308; } .dot-g { background:#22c55e; }
.url-bar { flex:1; height:32px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:0 12px;
           display:flex; align-items:center; color:#94a3b8; font-size:13px; margin-left:8px; }
.main { display:flex; height:672px; }
.sidebar { width:420px; background:#fff; border-right:1px solid #e2e8f0; padding:0; display:flex; flex-direction:column; }
.popup-header { background:#fff; border-bottom:1px solid #e2e8f0; padding:16px 20px; }
.popup-header h1 { font-size:20px; font-weight:700; color:#0f172a; }
.popup-header p { font-size:13px; color:#64748b; margin-top:2px; }
.tabs { display:flex; border-bottom:1px solid #e2e8f0; }
.tab { flex:1; padding:10px; text-align:center; font-size:13px; font-weight:500; color:#94a3b8; cursor:pointer; }
.tab.active { color:#2563eb; border-bottom:2px solid #2563eb; background:#eff6ff; }
.popup-body { flex:1; padding:20px; overflow:hidden; }
.label { font-size:12px; font-weight:600; color:#374151; margin-bottom:6px; display:block; }
.input { width:100%; height:40px; border:1px solid #d1d5db; border-radius:8px; padding:0 12px; font-size:14px; color:#1f2937; background:#fff; margin-bottom:16px; display:flex; align-items:center; }
.input.filled { color:#0f172a; }
.select { width:100%; height:40px; border:1px solid #d1d5db; border-radius:8px; padding:0 12px; font-size:14px; color:#1f2937; background:#fff; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; }
.row { display:flex; gap:12px; }
.row > div { flex:1; }
.btn-primary { width:100%; height:44px; background:linear-gradient(135deg,#2563eb,#4f46e5); color:#fff; border:none; border-radius:8px; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-top:8px; }
.content-area { flex:1; background:#f8fafc; display:flex; align-items:center; justify-content:center; }
.hero { text-align:center; max-width:560px; }
.hero-icon { font-size:64px; margin-bottom:16px; }
.hero h2 { font-size:28px; font-weight:700; color:#0f172a; margin-bottom:12px; }
.hero p { font-size:16px; color:#64748b; line-height:1.6; }
.badge { display:inline-block; background:#eff6ff; color:#2563eb; font-size:13px; font-weight:600; padding:4px 12px; border-radius:20px; margin:4px; }
.arrow { color:#94a3b8; font-size:14px; }
</style></head><body>
<div class="browser">
  <div class="toolbar">
    <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
    <div class="url-bar">customs.go.jp/tariff/</div>
  </div>
  <div class="main">
    <div class="sidebar">
      <div class="popup-header">
        <h1>TariffScope</h1>
        <p>FTA/EPA最適化ツール</p>
      </div>
      <div class="tabs">
        <div class="tab active">🔍 検索</div>
        <div class="tab">🕐 履歴</div>
      </div>
      <div class="popup-body">
        <span class="label">HSコード / 品目名</span>
        <div class="input filled">8507.10 - 鉛蓄電池</div>
        <div class="row">
          <div>
            <span class="label">輸出国</span>
            <div class="select"><span>🇯🇵 日本</span><span class="arrow">▼</span></div>
          </div>
          <div>
            <span class="label">輸入国</span>
            <div class="select"><span>🇨🇳 中国</span><span class="arrow">▼</span></div>
          </div>
        </div>
        <span class="label">貿易額（円）</span>
        <div class="input filled">1,000,000</div>
        <button class="btn-primary">関税を最適化</button>
      </div>
    </div>
    <div class="content-area">
      <div class="hero">
        <div class="hero-icon">🌐</div>
        <h2>貿易コストを最適化</h2>
        <p>HSコードと貿易ルートを入力するだけで、<br>最適なFTA/EPA協定を自動判定します。</p>
        <div style="margin-top:20px;">
          <span class="badge">RCEP</span><span class="badge">CPTPP</span><span class="badge">日EU EPA</span><span class="badge">日豪EPA</span>
          <br><span class="badge">日ASEAN</span><span class="badge">日中韓</span><span class="badge">+14協定</span>
        </div>
      </div>
    </div>
  </div>
</div>
</body></html>`;

// ── スクリーンショット2: 最適化結果 ──────────────────────
const screenshotResult = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1280px; height:800px; background:#f1f5f9; font-family:'Segoe UI','Noto Sans JP',sans-serif; display:flex; align-items:center; justify-content:center; }
.browser { width:1200px; height:720px; background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.12); overflow:hidden; }
.toolbar { height:48px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; padding:0 16px; gap:8px; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot-r { background:#ef4444; } .dot-y { background:#eab308; } .dot-g { background:#22c55e; }
.url-bar { flex:1; height:32px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:0 12px;
           display:flex; align-items:center; color:#94a3b8; font-size:13px; margin-left:8px; }
.main { height:672px; padding:32px 48px; overflow:hidden; display:flex; gap:32px; }
.col { flex:1; }
.card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:24px; margin-bottom:20px; }
.card h2 { font-size:18px; font-weight:700; color:#0f172a; margin-bottom:4px; }
.hs-badge { display:inline-block; background:#eff6ff; color:#2563eb; font-size:13px; font-weight:600; padding:4px 10px; border-radius:6px; }
.success-box { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:20px; margin-bottom:20px; }
.success-box h3 { color:#166534; font-size:15px; font-weight:600; display:flex; align-items:center; gap:8px; }
.success-box .amount { font-size:24px; font-weight:700; color:#166534; margin-top:8px; }
.success-box .detail { font-size:13px; color:#15803d; margin-top:4px; }
.mfn-bar { background:#f8fafc; border-radius:8px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; }
.mfn-bar .label { font-size:14px; color:#64748b; font-weight:500; }
.mfn-bar .value { font-size:20px; font-weight:700; color:#0f172a; }
.agreement { border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; }
.agreement.best { border-color:#86efac; background:#f0fdf4; }
.agreement .name { font-size:14px; font-weight:600; color:#0f172a; }
.agreement .name-en { font-size:11px; color:#94a3b8; margin-top:2px; }
.agreement .rate { font-size:14px; color:#64748b; margin-top:4px; }
.agreement .saving { font-size:22px; font-weight:700; color:#0f172a; text-align:right; }
.agreement .saving-label { font-size:11px; color:#64748b; text-align:right; }
.badge-best { background:#dcfce7; color:#166534; font-size:11px; font-weight:600; padding:2px 8px; border-radius:4px; margin-left:8px; }
.info-row { display:flex; gap:16px; margin-bottom:8px; font-size:13px; color:#64748b; }
.info-row span { font-weight:600; color:#374151; }
</style></head><body>
<div class="browser">
  <div class="toolbar">
    <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
    <div class="url-bar">TariffScope - 最適化結果</div>
  </div>
  <div class="main">
    <div class="col">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h2>最適化結果</h2>
          <span class="hs-badge">8507.10.0000</span>
        </div>
        <div class="info-row">輸出国: <span>🇯🇵 日本</span>　→　輸入国: <span>🇨🇳 中国</span>　　貿易額: <span>¥1,000,000</span></div>
        <div class="success-box">
          <h3>✅ 最適協定が見つかりました！</h3>
          <div style="margin-top:4px; font-size:14px; color:#15803d;">RCEP（地域的な包括的経済連携）</div>
          <div class="amount">¥100,000 削減</div>
          <div class="detail">関税率 10.0% → 0.0%（100.0% 削減）</div>
        </div>
        <div class="mfn-bar">
          <span class="label">基本関税率（MFN）</span>
          <span class="value">10.0%</span>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card" style="padding:20px;">
        <h2 style="margin-bottom:16px;">協定別関税率比較</h2>
        <div class="agreement best">
          <div>
            <div class="name">RCEP<span class="badge-best">推奨</span></div>
            <div class="name-en">Regional Comprehensive Economic Partnership</div>
            <div class="rate">関税率: 0.0%　｜　削減額: ¥100,000</div>
          </div>
          <div><div class="saving">-100%</div><div class="saving-label">削減率</div></div>
        </div>
        <div class="agreement">
          <div>
            <div class="name">日中韓投資協定</div>
            <div class="name-en">Japan-China-Korea Investment Treaty</div>
            <div class="rate">関税率: 3.0%　｜　削減額: ¥70,000</div>
          </div>
          <div><div class="saving">-70.0%</div><div class="saving-label">削減率</div></div>
        </div>
        <div class="agreement">
          <div>
            <div class="name">CPTPP（TPP11）</div>
            <div class="name-en">Comprehensive and Progressive TPP</div>
            <div class="rate">関税率: 5.0%　｜　削減額: ¥50,000</div>
          </div>
          <div><div class="saving">-50.0%</div><div class="saving-label">削減率</div></div>
        </div>
      </div>
    </div>
  </div>
</div>
</body></html>`;

// ── スクリーンショット3: HSコード自動検出 ──────────────
const screenshotDetect = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1280px; height:800px; background:#f1f5f9; font-family:'Segoe UI','Noto Sans JP',sans-serif; display:flex; align-items:center; justify-content:center; }
.browser { width:1200px; height:720px; background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.12); overflow:hidden; }
.toolbar { height:48px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; padding:0 16px; gap:8px; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot-r { background:#ef4444; } .dot-y { background:#eab308; } .dot-g { background:#22c55e; }
.url-bar { flex:1; height:32px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:0 12px;
           display:flex; align-items:center; color:#94a3b8; font-size:13px; margin-left:8px; }
.main { height:672px; padding:48px 64px; overflow:hidden; }
.page-title { font-size:22px; font-weight:700; color:#0f172a; margin-bottom:24px; }
.table { width:100%; border-collapse:collapse; }
.table th { background:#f8fafc; font-size:13px; color:#64748b; font-weight:600; padding:12px 16px; text-align:left; border-bottom:2px solid #e2e8f0; }
.table td { font-size:14px; color:#374151; padding:14px 16px; border-bottom:1px solid #f1f5f9; }
.hs-highlight { background:#fef3c7; border-bottom:2px solid #f59e0b; padding:2px 4px; border-radius:3px; cursor:pointer; position:relative; }
.tooltip { position:absolute; top:-36px; left:0; background:#1f2937; color:#fff; padding:6px 10px; border-radius:6px; font-size:12px; white-space:nowrap; }
.tooltip::after { content:''; position:absolute; bottom:-6px; left:16px; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid #1f2937; }
.notification { position:absolute; top:80px; right:48px; background:#1f2937; color:#fff; padding:14px 20px; border-radius:10px; font-size:14px; box-shadow:0 4px 16px rgba(0,0,0,0.2); display:flex; align-items:center; gap:10px; }
.noti-icon { width:28px; height:28px; background:linear-gradient(135deg,#0ea5e9,#4f46e5); border-radius:6px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:12px; }
.caption { text-align:center; margin-top:32px; }
.caption p { font-size:16px; color:#64748b; }
.caption .feature { display:inline-block; background:#eff6ff; color:#2563eb; font-size:14px; font-weight:600; padding:6px 16px; border-radius:20px; margin-top:12px; }
</style></head><body>
<div class="browser">
  <div class="toolbar">
    <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
    <div class="url-bar">www.customs.go.jp/tariff/2024/index.htm</div>
  </div>
  <div class="main" style="position:relative;">
    <div class="notification">
      <div class="noti-icon">TS</div>
      3件のHSコードを検出しました
    </div>
    <div class="page-title">実行関税率表（2024年4月版）</div>
    <table class="table">
      <tr><th>HSコード</th><th>品目名</th><th>単位</th><th>基本税率</th><th>WTO協定税率</th></tr>
      <tr>
        <td><span class="hs-highlight"><span class="tooltip">TariffScopeで詳細を確認</span>8507.10.0000</span></td>
        <td>鉛蓄電池（起動用のもの）</td><td>個</td><td>3.2%</td><td>無税</td>
      </tr>
      <tr>
        <td><span class="hs-highlight">8507.20.0000</span></td>
        <td>その他の鉛蓄電池</td><td>個</td><td>3.2%</td><td>無税</td>
      </tr>
      <tr>
        <td><span class="hs-highlight">8507.30.0000</span></td>
        <td>ニッケル・カドミウム蓄電池</td><td>個</td><td>3.2%</td><td>無税</td>
      </tr>
      <tr>
        <td>8507.40.0000</td>
        <td>ニッケル・鉄蓄電池</td><td>個</td><td>3.2%</td><td>無税</td>
      </tr>
      <tr>
        <td>8507.50.0000</td>
        <td>ニッケル・水素蓄電池</td><td>個</td><td>3.2%</td><td>無税</td>
      </tr>
      <tr>
        <td>8507.60.0000</td>
        <td>リチウムイオン蓄電池</td><td>個</td><td>3.2%</td><td>無税</td>
      </tr>
    </table>
    <div class="caption">
      <p>貿易関連サイトでHSコードを自動検出しハイライト表示</p>
      <span class="feature">クリックで即座に関税率を確認</span>
    </div>
  </div>
</div>
</body></html>`;

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  // アイコン生成 (16, 48, 128)
  for (const size of [16, 48, 128]) {
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(iconHtml(size));
    await page.screenshot({ path: path.join(OUT_DIR, `icon${size}.png`), type: 'png' });
    await page.close();
    console.log(`Generated icon${size}.png`);
  }

  // スクリーンショット生成 (1280x800)
  const screenshots = [
    { name: 'screenshot-1-search.png', html: screenshotSearch },
    { name: 'screenshot-2-result.png', html: screenshotResult },
    { name: 'screenshot-3-detect.png', html: screenshotDetect },
  ];

  for (const ss of screenshots) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.setContent(ss.html, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(OUT_DIR, ss.name), type: 'png' });
    await page.close();
    console.log(`Generated ${ss.name}`);
  }

  await browser.close();
  console.log(`\nAll assets saved to ${OUT_DIR}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
