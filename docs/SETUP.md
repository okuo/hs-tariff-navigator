# Trade Lens セットアップガイド

このガイドでは、Trade Lens Chrome拡張機能の完全なセットアップ手順を説明します。

## 📋 前提条件

開始前に以下が準備されていることを確認してください：

- **Node.js 18以上** - [公式サイト](https://nodejs.org/)からダウンロード
- **Chrome ブラウザ** - 最新版推奨
- **Supabaseアカウント** - [supabase.com](https://supabase.com)で無料登録
- **Git** - プロジェクトのクローンに必要

## 🚀 Step 1: プロジェクトのセットアップ

### 1.1 リポジトリのクローン

```bash
git clone <repository-url>
cd trade-lens
```

### 1.2 依存関係のインストール

```bash
npm install
```

インストールされる主な依存関係：
- React 18 (UI フレームワーク)
- TypeScript (型安全な開発)
- Supabase JS (データベースクライアント)
- Webpack 5 (ビルドツール)

## 🗄️ Step 2: Supabaseプロジェクトの作成

### 2.1 新規プロジェクトの作成

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. 「New project」をクリック
3. 以下の設定でプロジェクトを作成：
   - **Name**: `trade-lens`
   - **Database Password**: 安全なパスワードを設定
   - **Region**: `Northeast Asia (Tokyo)` 推奨

### 2.2 プロジェクト設定の取得

プロジェクト作成後、以下の情報を取得：

1. **Settings** → **API** に移動
2. 以下をコピー：
   - **Project URL** (例: `https://abcdefghijk.supabase.co`)
   - **anon public key** (例: `eyJhbGci...` で始まる長い文字列)

### 2.3 環境変数の設定

プロジェクトルートで環境変数ファイルを作成：

```bash
cp .env.example .env
```

`.env` ファイルを編集してSupabase情報を設定：

```env
# Supabase設定
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# 開発環境用設定
VITE_APP_ENV=development
VITE_LOG_LEVEL=development
```

## 🛢️ Step 3: データベースの初期化

### 3.1 スキーマの作成

Supabase SQL Editorで以下のファイルを順次実行：

#### 3.1.1 基本スキーマとインデックス
`database/schema.sql` の内容をコピー・ペーストして実行

#### 3.1.2 セキュリティポリシー
`database/security.sql` の内容をコピー・ペーストして実行

#### 3.1.3 ストアドファンクション
`database/functions.sql` の内容をコピー・ペーストして実行

### 3.2 サンプルデータの投入

#### 3.2.1 基本データ
`database/sample_data.sql` の内容をコピー・ペーストして実行

#### 3.2.2 拡張データ（オプション）
より多くのデータが必要な場合：

```sql
-- 拡張HSコードデータ
-- database/hs_codes_extended.sql の内容を実行

-- 拡張協定データ
-- database/agreements_extended.sql の内容を実行

-- 拡張関税率データ
-- database/tariff_rates_extended.sql の内容を実行
```

### 3.3 データベース確認

以下のクエリでデータが正常に投入されたか確認：

```sql
-- データ件数確認
SELECT 'HS Codes' as table_name, COUNT(*) as count FROM hs_codes
UNION ALL
SELECT 'Agreements', COUNT(*) FROM agreements
UNION ALL
SELECT 'Tariff Rates', COUNT(*) FROM tariff_rates;

-- 機能テスト
SELECT * FROM search_hs_codes('電池', 5);
```

## 🔨 Step 4: 拡張機能のビルド

### 4.1 開発ビルド

```bash
npm run build
```

ビルドが成功すると `dist/` フォルダに以下が生成されます：
- `manifest.json` - 拡張機能の設定
- `popup.html` - ポップアップのHTML
- `popup.js` - ポップアップのJavaScript
- `background.js` - Service Worker
- `content.js` - コンテンツスクリプト

### 4.2 ビルドエラーの対処

よくあるエラーと対処法：

**TypeScriptエラー**
```bash
npm run typecheck
# エラー箇所を修正後、再ビルド
```

**環境変数エラー**
```bash
# .envファイルの設定を確認
cat .env
```

## 🌐 Step 5: Chrome拡張機能の読み込み

### 5.1 デベロッパーモードの有効化

1. Chrome で `chrome://extensions/` にアクセス
2. 右上の「デベロッパーモード」トグルを **有効** にする

### 5.2 拡張機能の読み込み

1. 「パッケージ化されていない拡張機能を読み込む」をクリック
2. プロジェクトの `dist` フォルダを選択
3. 拡張機能が一覧に表示されることを確認

### 5.3 権限の確認

拡張機能カードで以下の権限が正しく設定されているか確認：
- ✅ storage (検索履歴の保存)
- ✅ activeTab (現在のタブへのアクセス)
- ✅ https://*.supabase.co/* (Supabaseへのアクセス)

## ✅ Step 6: 動作確認

### 6.1 基本機能のテスト

1. **拡張機能の起動**
   - Chromeツールバーの拡張機能アイコンをクリック
   - ポップアップが正常に表示されることを確認

2. **HSコード検索**
   - 検索窓に「電池」と入力
   - 検索結果が表示されることを確認

3. **関税最適化**
   - HSコードを選択
   - 輸出国: 日本、輸入国: 中国
   - 「関税最適化を実行」をクリック
   - 結果が表示されることを確認

### 6.2 トラブルシューティング

**ポップアップが表示されない**
- Chrome拡張機能の画面で再読み込みボタンをクリック
- ビルドエラーがないか確認

**検索結果が表示されない**
- DevToolsでコンソールエラーを確認
- Supabase接続情報が正しいか確認

**関税最適化が動作しない**
- データベースに関税率データが投入されているか確認
- ネットワークタブでAPI通信エラーを確認

## 🔧 開発者向け追加設定

### ホットリロード設定

開発効率を上げるために、ファイル変更を監視するモードを使用：

```bash
npm run dev
```

このモードでは：
- ファイル変更時に自動でリビルド
- Chrome拡張機能の手動再読み込みが必要

### デバッグ設定

#### ポップアップのデバッグ
1. 拡張機能アイコンを右クリック
2. 「検証」を選択
3. DevToolsでJavaScriptをデバッグ

#### バックグラウンドスクリプトのデバッグ
1. `chrome://extensions/` の拡張機能カード
2. 「サービスワーカー」をクリック
3. DevToolsでデバッグ

## 📈 次のステップ

セットアップが完了したら：

1. **データの拡充**: より多くのHSコードや協定データを追加
2. **機能の拡張**: 新しい分析機能の実装
3. **UI/UXの改善**: ユーザビリティの向上

詳細は [開発ロードマップ](../README.md#-今後の開発ロードマップ) を参照してください。

## 🆘 サポート

セットアップでお困りの場合：

1. [トラブルシューティングガイド](TROUBLESHOOTING.md) を確認
2. [GitHub Issues](../../issues) で質問
3. [GitHub Discussions](../../discussions) でコミュニティに相談

---

**セットアップ完了お疲れさまでした！Trade Lensで効率的な貿易業務をお楽しみください。**