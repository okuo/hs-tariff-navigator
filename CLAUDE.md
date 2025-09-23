# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「Trade Lens」は日本企業の貿易コスト削減を支援するChrome拡張機能です。HSコード検索とFTA/EPA協定の最適な関税率を自動判定し、削減額をシミュレーションします。

### 主要機能
- HSコード検索（88品目収録）
- FTA/EPA関税最適化（20協定対応）
- 削減額シミュレーション
- 検索履歴管理

### 技術スタック
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Build**: Webpack 5
- **Extension**: Chrome Manifest V3

## 開発コマンド

### 基本コマンド
```bash
# 依存関係インストール
npm install

# 開発ビルド（ファイル監視）
npm run dev

# 本番ビルド
npm run build

# 型チェック
npm run typecheck

# 拡張機能パッケージ化
npm run pack
```

### Chrome拡張機能の読み込み
1. Chrome で `chrome://extensions/` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」で `dist` フォルダを選択

## データベースセットアップ

### Supabase設定
```bash
# 環境変数設定
cp .env.example .env
# .env を編集してSupabase認証情報を設定
```

### データベース初期化
Supabase SQL Editorで以下を順次実行：
```bash
database/schema.sql      # スキーマ・インデックス
database/security.sql    # RLSポリシー  
database/functions.sql   # ストアドファンクション
database/sample_data.sql # 基本データ

# 拡張データ（オプション）
database/hs_codes_extended.sql
database/agreements_extended.sql
database/tariff_rates_extended.sql
```

## プロジェクト構造

Chrome拡張機能の基本構造：

```
/
├── manifest.json          # 拡張機能の設定ファイル
├── popup/                 # ポップアップUI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── content/               # コンテンツスクリプト
│   └── content.js
├── background/            # バックグラウンドスクリプト
│   └── background.js
├── options/               # オプションページ
│   ├── options.html
│   └── options.js
└── assets/               # アイコンや画像
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 重要な開発ポイント

### manifest.json設定
- Manifest V3を使用
- 必要な権限（permissions）の最小化
- host_permissionsでアクセス可能なサイトを制限

### コンテンツスクリプト
- ウェブページのDOMに直接アクセス
- ページの貿易関連データを抽出・分析

### ポップアップ
- ユーザーインターフェースの主要部分
- 分析結果の表示とユーザー操作

### バックグラウンドスクリプト
- データの永続化
- API通信やクロスタブ機能

## デバッグ方法

- Chrome DevTools でポップアップのデバッグ
- コンテンツスクリプトはページのDevToolsでデバッグ
- バックグラウンドスクリプトは chrome://extensions/ の「サービスワーカー」からデバッグ