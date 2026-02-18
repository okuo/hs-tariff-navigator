# TariffScope トラブルシューティング

TariffScopeの使用中に発生する可能性がある問題と解決方法をまとめました。

## Chrome拡張機能関連

### 拡張機能が読み込めない

**症状**: Chrome拡張機能の読み込み時にエラーが発生する

**解決策**:

1. **manifest.jsonの構文確認**
   ```bash
   # JSONの構文チェック
   node -e "JSON.parse(require('fs').readFileSync('dist/manifest.json','utf8'))"
   ```

2. **ビルドの再実行**
   ```bash
   npm run clean
   npm run build
   ```

3. **distフォルダの確認**
   - `dist/manifest.json` が存在するか確認
   - `chrome://extensions/` で「デベロッパーモード」が有効か確認
   - `dist` フォルダ（プロジェクトルートではなく）を選択しているか確認

### ポップアップが表示されない

**症状**: 拡張アイコンをクリックしてもポップアップが開かない

**解決策**:

1. **拡張機能のリロード**
   - `chrome://extensions/` でTariffScopeの更新ボタンをクリック

2. **DevToolsでエラー確認**
   - 拡張アイコンを右クリック → 「検証」
   - Consoleタブでエラーメッセージを確認

3. **ファイル確認**
   - `dist/popup.html` が存在するか確認
   - `dist/popup.js` が存在するか確認

### Service Workerエラー

**症状**: バックグラウンド処理が動作しない

**解決策**:

1. **Service Workerの状態確認**
   - `chrome://extensions/` で「サービスワーカー」をクリック
   - エラーログを確認

2. **Manifest V3互換性チェック**
   ```json
   // dist/manifest.json で確認
   {
     "manifest_version": 3,
     "background": {
       "service_worker": "background.js"
     }
   }
   ```

## データ・検索関連

### HSコード検索結果が表示されない

**症状**: 検索しても「結果がありません」と表示される

**解決策**:

1. **データファイルの存在確認**
   - `dist/data/hs_codes.json` が存在するか確認
   - `dist/data/data-manifest.json` が存在するか確認

2. **キャッシュのクリア**
   ```javascript
   // DevTools Console で実行
   chrome.storage.local.clear(() => console.log('Cache cleared'));
   ```

3. **拡張機能のリロード**
   - `chrome://extensions/` で更新ボタンをクリック
   - ポップアップを再度開く

### 関税最適化が動作しない

**症状**: 「関税最適化を実行」をクリックしても結果が表示されない

**解決策**:

1. **関税率データの確認**
   - `dist/data/tariff_rates.json` が存在するか確認
   - `dist/data/agreements.json` が存在するか確認

2. **入力値の確認**
   - HSコードが選択されているか確認
   - 輸出国・輸入国が選択されているか確認
   - 選択した国の組み合わせに対応する協定データが存在するか確認

3. **DevToolsで通信確認**
   - ポップアップを右クリック → 「検証」
   - Consoleタブでエラーを確認

### HSコード自動検出が動作しない

**症状**: 対象サイト上でHSコードがハイライト表示されない

**解決策**:

1. **対象サイトの確認**
   対象は以下の8ドメインのみ:
   - jetro.go.jp
   - customs.go.jp
   - meti.go.jp
   - mofa.go.jp
   - tradestats.go.jp
   - alibaba.com
   - made-in-china.com
   - globalsources.com

2. **コンテンツスクリプトの確認**
   - 対象サイトのDevToolsコンソールで `[TariffScope]` ログを確認
   - 拡張機能が対象サイトへのアクセス権限を持っているか確認

3. **ページの再読み込み**
   - 拡張機能インストール後、対象サイトを再読み込み

## ビルド・開発関連

### TypeScriptコンパイルエラー

**症状**: `npm run build` 時にTypeScriptエラー

**解決策**:

1. **型チェックの実行**
   ```bash
   npm run type-check
   ```

2. **依存関係の再インストール**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Webpackビルドエラー

**症状**: ビルド時に「Module not found」エラー

**解決策**:

1. **パスエイリアスの確認**
   - `tsconfig.json` の `paths` 設定と `webpack.config.js` の `alias` 設定が一致しているか確認
   - `@/*` は `src/*` にマップされる

2. **インポートパスの確認**
   - ファイルが正しいパスに存在するか確認
   - 大文字小文字が正確か確認（特にLinux/CI環境）

### テスト失敗

**症状**: `npm test` でテストが失敗する

**解決策**:

1. **テストの個別実行**
   ```bash
   npx jest --verbose
   ```

2. **Chromeモックの確認**
   - テストでは `src/test/mocks/chrome.ts` のモックが使用される
   - Chrome APIの呼び出しがモックされているか確認

## パフォーマンス関連

### 拡張機能が遅い

**症状**: ポップアップの表示や検索が遅い

**解決策**:

1. **キャッシュの確認**
   ```javascript
   // DevTools Console で実行
   chrome.storage.local.get(null, (data) => {
     console.log('Storage size:', JSON.stringify(data).length, 'bytes');
   });
   ```

2. **キャッシュのクリア**
   ```javascript
   chrome.storage.local.clear(() => console.log('Cache cleared'));
   ```
   次回起動時にデータが再キャッシュされます。

3. **検索履歴のクリア**
   ポップアップの検索履歴タブから「履歴をクリア」を実行

## デバッグ手順

### 1. DevToolsの活用

#### ポップアップのデバッグ
1. 拡張アイコンを右クリック → 「検証」
2. Elements, Console, Network, Application タブを使用

#### Service Workerのデバッグ
1. `chrome://extensions/` → 「サービスワーカー」をクリック
2. DevToolsでバックグラウンド処理を確認

#### ストレージの確認
```javascript
// DevTools Console で実行
chrome.storage.local.get(null, console.log);
chrome.storage.local.clear(); // クリア
```

### 2. ネットワーク通信の確認
```javascript
// DevToolsのNetworkタブでchrome-extension://のリクエストを確認
// data/*.json の読み込みが成功しているか確認
```

## セルフチェックリスト

問題発生時は以下をチェック:
- [ ] Chrome拡張機能が最新のdistフォルダを読み込んでいる
- [ ] `npm run build` が正常に完了している
- [ ] DevToolsでJavaScriptエラーが発生していない
- [ ] `dist/data/` にデータファイルが存在する
- [ ] インターネット接続が正常（初回データ読み込み時）

## さらなるサポート

上記で解決しない場合:
1. **GitHub Issues**: [Issues](../../issues) で新しい問題を報告
2. **ドキュメント**: [README.md](../README.md) で基本情報を再確認
3. **API リファレンス**: [API.md](API.md) でデータ構造を確認

---

**問題が解決したら、同じ問題で困っている他のユーザーのためにソリューションをシェアしていただけると幸いです！**
