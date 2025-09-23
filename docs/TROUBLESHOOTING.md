# Trade Lens トラブルシューティング

Trade Lensの使用中に発生する可能性がある問題と解決方法をまとめました。

## 🚨 よくある問題と解決方法

### Chrome拡張機能関連

#### ❌ 拡張機能が読み込めない

**症状**: Chrome拡張機能の読み込み時にエラーが発生する

**原因と解決策**:

1. **manifest.jsonエラー**
   ```bash
   # manifest.jsonの構文確認
   cat public/manifest.json | python -m json.tool
   ```

2. **ビルドエラー**
   ```bash
   # プロジェクトの再ビルド
   npm run clean
   npm run build
   ```

3. **権限不足**
   - Chrome拡張機能管理画面で「デベロッパーモード」が有効か確認
   - `dist`フォルダを正しく選択しているか確認

#### ❌ ポップアップが表示されない

**症状**: 拡張機能アイコンをクリックしてもポップアップが開かない

**解決策**:
1. **拡張機能の再読み込み**
   - `chrome://extensions/` で Trade Lens の「更新」ボタンをクリック

2. **DevToolsでエラー確認**
   - 拡張機能アイコンを右クリック → 「検証」
   - Console タブでエラーメッセージを確認

3. **ファイル権限確認**
   ```bash
   # distフォルダの権限確認
   ls -la dist/
   # popup.htmlが存在するか確認
   ls -la dist/popup.html
   ```

#### ❌ Service Worker エラー

**症状**: バックグラウンド処理が動作しない

**解決策**:
1. **Service Workerの状態確認**
   - `chrome://extensions/` で「サービスワーカー」をクリック
   - エラーログを確認

2. **Manifest V3準拠チェック**
   ```json
   // public/manifest.json で確認
   {
     "manifest_version": 3,
     "background": {
       "service_worker": "background.js"
     }
   }
   ```

### Supabase接続関連

#### ❌ データベース接続エラー

**症状**: 「Supabase client initialization failed」

**解決策**:

1. **環境変数の確認**
   ```bash
   # .envファイルの内容確認
   cat .env
   ```
   
   必要な設定:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

2. **Supabaseプロジェクトの状態確認**
   - [Supabase Dashboard](https://supabase.com/dashboard) でプロジェクトが「Active」状態か確認
   - 「Settings」→「API」でURLとキーが正しいか確認

3. **ネットワークアクセス確認**
   ```javascript
   // DevToolsのNetworkタブでSupabaseへのリクエストを確認
   // CORS エラーがないかチェック
   ```

#### ❌ RPC関数エラー

**症状**: 「function search_hs_codes(text, integer) does not exist」

**解決策**:
1. **データベース関数の確認**
   ```sql
   -- Supabase SQL Editorで実行
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_type = 'FUNCTION';
   ```

2. **関数の再作成**
   - `database/functions.sql` の内容を再実行
   - pg_trgm拡張が有効化されているか確認

#### ❌ Row Level Security エラー

**症状**: 「new row violates row-level security policy」

**解決策**:
1. **RLSポリシーの確認**
   ```sql
   -- ポリシー一覧確認
   SELECT tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies;
   ```

2. **セキュリティポリシーの再設定**
   - `database/security.sql` の内容を再実行

### データ検索関連

#### ❌ HSコード検索結果が表示されない

**症状**: 検索しても「結果がありません」と表示される

**解決策**:

1. **データ存在確認**
   ```sql
   -- Supabase SQL Editorで実行
   SELECT COUNT(*) FROM hs_codes;
   SELECT * FROM hs_codes LIMIT 5;
   ```

2. **検索関数のテスト**
   ```sql
   -- 直接検索関数をテスト
   SELECT * FROM search_hs_codes('電池', 5);
   ```

3. **文字エンコーディング確認**
   - 日本語検索キーワードが正しく送信されているかネットワークタブで確認

#### ❌ 関税最適化が動作しない

**症状**: 「最適化を実行」をクリックしても結果が表示されない

**解決策**:

1. **関税率データの確認**
   ```sql
   -- 関税率データの存在確認
   SELECT COUNT(*) FROM tariff_rates;
   SELECT * FROM tariff_rates 
   WHERE hs_code = '8507100000' 
     AND country_from = 'JP' 
     AND country_to = 'CN';
   ```

2. **協定データの確認**
   ```sql
   -- 協定データの確認
   SELECT * FROM agreements WHERE is_active = true;
   ```

3. **最適化関数のテスト**
   ```sql
   -- 直接最適化関数をテスト
   SELECT optimize_tariff('8507100000', 'JP', 'CN', 1000000);
   ```

### ビルド・開発関連

#### ❌ TypeScriptコンパイルエラー

**症状**: `npm run build` 時にTypeScriptエラー

**解決策**:

1. **型定義の確認**
   ```bash
   # TypeScript型チェック
   npm run typecheck
   ```

2. **型定義ファイルの更新**
   ```typescript
   // src/types/database.ts が最新のスキーマと一致しているか確認
   ```

3. **依存関係の再インストール**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### ❌ Webpack ビルドエラー

**症状**: ビルド時に「Module not found」エラー

**解決策**:

1. **パス設定の確認**
   ```javascript
   // webpack.config.js のalias設定を確認
   resolve: {
     alias: {
       '@': path.resolve(__dirname, 'src'),
     }
   }
   ```

2. **ファイル存在確認**
   ```bash
   # インポートしているファイルが存在するか確認
   find src/ -name "*.ts" -o -name "*.tsx"
   ```

### パフォーマンス関連

#### ❌ 拡張機能が重い・遅い

**症状**: ポップアップの表示や検索が遅い

**解決策**:

1. **バンドルサイズの確認**
   ```bash
   # ビルドファイルサイズの確認
   ls -lah dist/
   ```

2. **不要な依存関係の削除**
   ```bash
   # 未使用の依存関係をチェック
   npx depcheck
   ```

3. **キャッシュのクリア**
   ```javascript
   // DevToolsでストレージをクリア
   chrome.storage.local.clear();
   ```

## 🔧 デバッグ手順

### 1. ログレベルの設定

```typescript
// src/utils/logger.ts
const LOG_LEVEL = process.env.VITE_LOG_LEVEL || 'info';

export function debugLog(message: string, data?: any) {
  if (LOG_LEVEL === 'development') {
    console.log('[Trade Lens Debug]', message, data);
  }
}
```

### 2. DevToolsの活用

#### ポップアップのデバッグ
1. 拡張機能アイコンを右クリック → 「検証」
2. Elements, Console, Network, Application タブを使用

#### Service Workerのデバッグ
1. `chrome://extensions/` → 「サービスワーカー」をクリック
2. DevToolsでバックグラウンド処理を監視

#### ストレージの確認
```javascript
// DevTools Console で実行
chrome.storage.local.get(null, console.log);
chrome.storage.local.clear(); // クリア
```

### 3. ネットワーク通信の監視

```javascript
// fetch通信のログ出力
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch:', args);
  return originalFetch.apply(this, args);
};
```

## 📞 サポート情報

### エラーレポート時の情報収集

問題報告時は以下の情報を含めてください：

1. **環境情報**
   - OS: Windows/Mac/Linux
   - Chrome バージョン
   - Trade Lens バージョン

2. **エラー情報**
   - エラーメッセージの全文
   - DevToolsのConsoleログ
   - 再現手順

3. **設定情報**
   ```bash
   # .envファイルの内容（秘密情報は伏せる）
   VITE_SUPABASE_URL=https://*****.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci***** (一部)
   ```

### よくある設定ミス

#### ❌ 環境変数の設定ミス
```bash
# 間違い例
SUPABASE_URL=...          # VITE_ プレフィックスがない
VITE_SUPABASE_URL=http... # HTTPSではなくHTTP
```

#### ❌ Supabaseプロジェクト設定ミス
- プロジェクトが一時停止状態
- API キーが正しくコピーされていない
- 地域設定が異なる

### セルフチェックリスト

問題発生時は以下をチェック：

- [ ] Chrome拡張機能が最新のdistフォルダを読み込んでいる
- [ ] .envファイルが正しく設定されている  
- [ ] Supabaseプロジェクトがアクティブ状態
- [ ] 必要なデータベーステーブルと関数が存在する
- [ ] インターネット接続が正常
- [ ] DevToolsでJavaScriptエラーが発生していない

## 🆘 さらなるサポート

上記で解決しない場合：

1. **GitHubイシュー**: [Issues](../../issues) で新しい問題を報告
2. **ディスカッション**: [Discussions](../../discussions) でコミュニティに相談
3. **ドキュメント**: [README.md](../README.md) で基本情報を再確認

---

**問題が解決したら、同じ問題で困っている他のユーザーのためにソリューションをシェアしていただけると幸いです！**