// Content Script for TariffScope Chrome Extension
import { TRADE_RELATED_DOMAINS, CONTENT_SCRIPT_CONFIG } from '@/utils/constants';

console.log('TariffScope Content Script loaded');

// Debounce utility
function debounce(fn: () => void, ms: number): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

// HSコードパターンの正規表現
const HS_CODE_PATTERNS = [
  /\b\d{4}\.\d{2}\.\d{4}\b/g,  // 4桁.2桁.4桁 (例: 8507.10.0000)
  /\b\d{10}\b/g,               // 10桁連続 (例: 8507100000)
  /\b\d{6}\b/g,                // 6桁連続 (例: 850710)
  /\bHS\s*:?\s*(\d{4}\.?\d{2}\.?\d{4})\b/gi, // HS: で始まるパターン
];

// 現在のページが貿易関連サイトかチェック
function isTradeRelatedSite(): boolean {
  const hostname = window.location.hostname;
  return TRADE_RELATED_DOMAINS.some(domain => hostname.includes(domain));
}

// ページからHSコードを抽出
function extractHSCodes(): string[] {
  const bodyText = document.body.innerText;
  const foundCodes = new Set<string>();

  HS_CODE_PATTERNS.forEach(pattern => {
    const matches = bodyText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // HSコードを正規化（ドットを除去）
        const normalized = match.replace(/[^0-9]/g, '');
        if (normalized.length >= 6) {
          foundCodes.add(normalized);
        }
      });
    }
  });

  return Array.from(foundCodes);
}

// HSコードにハイライトを追加
function highlightHSCodes(): void {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes: Text[] = [];
  let node: Node | null = walker.nextNode();
  let nodeCount = 0;
  while (node && nodeCount < CONTENT_SCRIPT_CONFIG.MAX_NODE_COUNT) {
    if (node.parentElement?.tagName !== 'SCRIPT' &&
        node.parentElement?.tagName !== 'STYLE' &&
        !node.parentElement?.classList?.contains('hs-tariff-navigator-highlight')) {
      textNodes.push(node as Text);
    }
    node = walker.nextNode();
    nodeCount++;
  }

  textNodes.forEach(textNode => {
    let modified = false;
    let content = textNode.textContent || '';

    HS_CODE_PATTERNS.forEach(pattern => {
      content = content.replace(pattern, (match) => {
        modified = true;
        return `<span class="hs-tariff-navigator-highlight" data-hs-code="${match.replace(/[^0-9]/g, '')}"
                      title="TariffScopeで詳細を確認">${match}</span>`;
      });
    });

    if (modified) {
      const wrapper = document.createElement('span');
      wrapper.innerHTML = content;
      textNode.parentNode?.replaceChild(wrapper, textNode);
    }
  });
}

// ハイライトのスタイルを追加
function addHighlightStyles(): void {
  if (document.getElementById('hs-tariff-navigator-styles')) return;

  const style = document.createElement('style');
  style.id = 'hs-tariff-navigator-styles';
  style.textContent = `
    .hs-tariff-navigator-highlight {
      background-color: #fef3c7 !important;
      border-bottom: 2px solid #f59e0b !important;
      cursor: pointer !important;
      position: relative !important;
      padding: 1px 2px !important;
      border-radius: 2px !important;
    }

    .hs-tariff-navigator-highlight:hover {
      background-color: #fde68a !important;
      border-bottom-color: #d97706 !important;
    }

    .hs-tariff-navigator-tooltip {
      position: absolute;
      top: -30px;
      left: 0;
      background: #1f2937;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    }

    .hs-tariff-navigator-highlight:hover .hs-tariff-navigator-tooltip {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}

// HSコードクリック時の処理
function handleHSCodeClick(event: Event): void {
  const target = event.target as HTMLElement;
  if (!target.classList.contains('hs-tariff-navigator-highlight')) return;

  const hsCode = target.getAttribute('data-hs-code');
  if (!hsCode) return;

  // TariffScopeポップアップを開く（将来的にはポップアップ内で直接表示）
  chrome.runtime.sendMessage({
    type: 'HS_CODE_CLICKED',
    hsCode: hsCode,
    url: window.location.href,
    context: target.textContent
  });

  // ユーザーに通知
  showNotification(`HSコード ${hsCode} をTariffScopeで確認できます`);
}

// 通知表示
function showNotification(message: string): void {
  // 既存の通知を削除
  const existing = document.getElementById('hs-tariff-navigator-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.id = 'hs-tariff-navigator-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1f2937;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 10000;
    font-family: 'Noto Sans JP', Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

  // アニメーション用CSS
  if (!document.getElementById('hs-tariff-navigator-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'hs-tariff-navigator-notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // 3秒後に自動削除
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

// メイン処理
function initialize(): void {
  // 貿易関連サイトでのみ動作
  if (!isTradeRelatedSite()) {
    console.log('Not a trade-related site, skipping HSCode detection');
    return;
  }

  console.log('Trade-related site detected, initializing HSCode detection');

  // スタイルを追加
  addHighlightStyles();

  // HSコードをハイライト
  highlightHSCodes();

  // クリックイベントを設定
  document.addEventListener('click', handleHSCodeClick);

  // 動的に追加されるコンテンツを監視（デバウンス付き）
  const debouncedHighlight = debounce(() => {
    highlightHSCodes();
  }, CONTENT_SCRIPT_CONFIG.DEBOUNCE_MS);

  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          shouldUpdate = true;
        }
      });
    });

    if (shouldUpdate) {
      debouncedHighlight();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // ページに見つかったHSコード数を報告
  const extractedCodes = extractHSCodes();
  if (extractedCodes.length > 0) {
    console.log(`Found ${extractedCodes.length} HS codes:`, extractedCodes);
    chrome.runtime.sendMessage({
      type: 'HS_CODES_DETECTED',
      codes: extractedCodes,
      url: window.location.href
    });
  }
}

// ページ読み込み完了時に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// メッセージリスナー（Background Scriptからの通信）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_PAGE_HS_CODES': {
      const codes = extractHSCodes();
      sendResponse({ codes });
      break;
    }
    case 'HIGHLIGHT_HS_CODE': {
      const targetCode = message.hsCode;
      const highlights = document.querySelectorAll(`[data-hs-code="${targetCode}"]`);
      highlights.forEach(el => {
        (el as HTMLElement).style.animation = 'pulse 1s ease-in-out 3';
      });
      sendResponse({ highlighted: highlights.length });
      break;
    }

    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

export {};
