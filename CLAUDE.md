# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「TariffScope」は日本企業の貿易コスト削減を支援するChrome拡張機能です。HSコード検索とFTA/EPA協定の最適な関税率を自動判定し、削減額をシミュレーションします。

### 主要機能
- HSコード検索（88品目収録）
- FTA/EPA関税最適化（20協定対応）
- 削減額シミュレーション
- 検索履歴管理
- 貿易関連サイトでのHSコード自動検出

### 技術スタック
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Data**: ローカルJSONファイル（public/data/）+ Chrome Storage APIキャッシュ
- **Build**: Webpack 5
- **Test**: Jest + Testing Library
- **CI/CD**: GitHub Actions → Chrome Web Store自動デプロイ
- **Extension**: Chrome Manifest V3

## 開発コマンド

```bash
# 依存関係インストール
npm install

# 開発ビルド（ファイル監視）
npm run dev

# 本番ビルド
npm run build

# 型チェック
npm run type-check

# Lintチェック
npm run lint

# テスト実行
npm test

# CWS用zipパッケージ作成
npm run pack:zip

# リリース（patch/minor/major）
npm run release:patch
```

### Chrome拡張機能の読み込み
1. Chrome で `chrome://extensions/` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」で `dist` フォルダを選択

## プロジェクト構造

```
public/
├── manifest.json              # Chrome拡張マニフェスト (Manifest V3)
├── icons/                     # 拡張アイコン (16/48/128px)
└── data/                      # HSコード・協定・関税率データ (JSON)
src/
├── background/index.ts        # Service Worker（データ更新、メッセージハンドリング）
├── content/index.ts           # コンテンツスクリプト（HSコード検出・ハイライト）
├── popup/                     # ポップアップUI
│   ├── App.tsx                # メインアプリコンポーネント
│   └── popup.html             # エントリーHTML
├── components/                # Reactコンポーネント
│   ├── HSCodeSearch.tsx       # HSコード検索フォーム
│   ├── TariffComparison.tsx   # 関税比較結果表示
│   ├── SearchHistory.tsx      # 検索履歴
│   ├── OriginRulesGuide.tsx   # 原産地規則ガイド
│   └── Toast.tsx              # トースト通知
├── lib/                       # コアロジック
│   ├── api.ts                 # 統合APIインターフェース
│   ├── dataService.ts         # データ取得・キャッシュ管理
│   ├── search.ts              # 3-gram類似度検索
│   └── tariffOptimizer.ts     # 関税最適化計算
├── types/index.ts             # TypeScript型定義
└── utils/constants.ts         # 定数（国コード、協定、対象ドメイン等）
scripts/
├── sync-version.js            # package.json → manifest.json バージョン同期
└── generate-store-assets.js   # CWSストア画像生成（Puppeteer）
.github/workflows/
├── ci.yml                     # CI: type-check → lint → test → build
└── release.yml                # CD: build → GitHub Release → CWSアップロード
```

## 重要な開発ポイント

### データアーキテクチャ
- 外部DBは使用しない。全データは `public/data/*.json` に同梱
- Chrome Storage APIでローカルキャッシュ（有効期限24時間）
- 非拡張環境（開発時）ではlocalStorageにフォールバック

### manifest.json設定
- Manifest V3を使用
- permissions: storage, activeTab, alarms のみ（最小権限）
- content_scriptsは貿易関連8ドメインに限定

### コンテンツスクリプト
- 対象ドメイン: jetro.go.jp, customs.go.jp, meti.go.jp, mofa.go.jp, tradestats.go.jp, alibaba.com, made-in-china.com, globalsources.com
- ページ上のHSコードパターンを検出しハイライト表示

### リリースフロー
```
npm run release:patch
  → type-check + lint + test（品質ガード）
  → npm version patch（package.json更新）
  → version hook（manifest.json同期 + git add）
  → git commit + tag
  → git push + push tags
  → GitHub Actions: build → GitHub Release → CWSアップロード
```

## デバッグ方法
- ポップアップ: 拡張アイコン右クリック → 「検証」
- コンテンツスクリプト: 対象ページのDevToolsコンソール
- Service Worker: chrome://extensions/ の「サービスワーカー」リンク
