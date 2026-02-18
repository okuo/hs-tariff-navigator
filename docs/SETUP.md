# TariffScope セットアップガイド

TariffScope Chrome拡張機能の開発環境セットアップ手順を説明します。

## 前提条件

- **Node.js 18以上** - [公式サイト](https://nodejs.org/)からダウンロード
- **Chrome ブラウザ** - 最新安定版
- **Git** - リポジトリのクローンに必要

## Step 1: プロジェクトのセットアップ

### 1.1 リポジトリのクローン

```bash
git clone https://github.com/okuo/hs-tariff-navigator.git
cd hs-tariff-navigator
```

### 1.2 依存関係のインストール

```bash
npm install
```

主な依存関係:
- React 18 (UI フレームワーク)
- TypeScript (型安全な開発)
- Tailwind CSS (スタイリング)
- Webpack 5 (ビルドツール)

## Step 2: 拡張機能のビルド

### 2.1 開発ビルド

```bash
npm run dev
```

ファイル変更を監視し、自動で再ビルドします。

### 2.2 本番ビルド

```bash
npm run build
```

ビルドが成功すると `dist/` フォルダに以下が生成されます:
- `manifest.json` - 拡張機能の設定
- `popup.html` - ポップアップUIのHTML
- `popup.js` - ポップアップUIのJavaScript
- `background.js` - Service Worker
- `content.js` - コンテンツスクリプト
- `icons/` - 拡張アイコン
- `data/` - HSコード・協定・関税率データ

### 2.3 ビルドエラーの対処

**TypeScriptエラー**
```bash
npm run type-check
# エラー箇所を修正後、再ビルド
```

**依存関係エラー**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Step 3: Chrome拡張機能の読み込み

### 3.1 デベロッパーモードの有効化

1. Chrome で `chrome://extensions/` にアクセス
2. 右上の「デベロッパーモード」トグルを **有効** にする

### 3.2 拡張機能の読み込み

1. 「パッケージ化されていない拡張機能を読み込む」をクリック
2. プロジェクトの `dist` フォルダを選択
3. TariffScope が一覧に表示されることを確認

### 3.3 権限の確認

拡張機能カードで以下の権限が設定されていることを確認:
- storage (データキャッシュ)
- activeTab (現在のタブへのアクセス)
- alarms (定期的なデータ更新)

## Step 4: 動作確認

### 4.1 基本機能のテスト

1. **拡張機能の起動**
   - Chromeツールバーの拡張アイコンをクリック
   - ポップアップが正常に表示されることを確認

2. **HSコード検索**
   - 検索欄に「電池」と入力
   - 検索結果が表示されることを確認

3. **関税最適化**
   - HSコードを選択
   - 輸出国: 日本、輸入国: 中国
   - 「関税最適化を実行」をクリック
   - 結果が表示されることを確認

4. **HSコード自動検出**
   - [JETRO](https://www.jetro.go.jp/) などの対象サイトにアクセス
   - ページ上のHSコードがハイライト表示されることを確認

## Step 5: 開発者向け追加設定

### ホットリロード設定

開発効率を上げるために、ファイル変更を監視するモードを使用:

```bash
npm run dev
```

このモードでは:
- ファイル変更時に自動でリビルド
- Chrome拡張機能の手動リロード（拡張管理画面で更新ボタン）が必要

### デバッグ設定

#### ポップアップのデバッグ
1. 拡張アイコンを右クリック
2. 「検証」を選択
3. DevToolsでJavaScriptをデバッグ

#### Service Workerのデバッグ
1. `chrome://extensions/` の拡張カード
2. 「サービスワーカー」をクリック
3. DevToolsでバックグラウンド処理を確認

#### コンテンツスクリプトのデバッグ
1. 対象サイト（jetro.go.jp等）のDevToolsを開く
2. Consoleタブで `[TariffScope]` プレフィックスのログを確認

### テストの実行

```bash
# 全テスト実行
npm test

# 型チェック
npm run type-check

# Lintチェック
npm run lint

# 全品質チェック（CI相当）
npm run type-check && npm run lint && npm test
```

## 次のステップ

セットアップが完了したら:
1. [API リファレンス](API.md) でデータ構造とAPI関数を確認
2. [トラブルシューティング](TROUBLESHOOTING.md) で問題解決方法を参照

---

**セットアップ完了お疲れさまでした！TariffScopeでの開発をお楽しみください。**
