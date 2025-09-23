# Trade Lens - FTA/EPA最適化Chrome拡張機能

日本企業の貿易コスト削減を支援するChrome拡張機能です。HSコード検索とFTA/EPA協定の最適な関税率を自動判定し、削減額をシミュレーションします。

## 🌟 主な機能

- **HSコード検索**: 商品名または番号から該当するHSコードを検索
- **関税最適化**: 各国間のFTA/EPA協定を比較して最適な関税率を提案
- **削減額計算**: 貿易金額を元にした関税削減額のシミュレーション
- **協定情報**: 原産地証明書の要件など詳細な適用条件を表示
- **検索履歴**: 過去の検索結果を保存・参照

## 📊 データ収録状況（2024年12月現在）

| データ種別 | 収録数 | カバー範囲 |
|-----------|--------|-----------|
| HSコード | 88品目 | 主要貿易品目（貿易額ベース約40-50%） |
| FTA/EPA協定 | 20協定 | 日本が締結済みの主要協定 |
| 関税率データ | 130件 | 協定別・品目別の優遇税率 |

### 収録済みFTA/EPA協定

- **RCEP**（地域的な包括的経済連携）
- **CPTPP**（環太平洋パートナーシップ協定）
- **日EU EPA**、**日英EPA**、**日豪EPA**
- **日米貿易協定**
- 各種二国間EPA（ASEAN各国、スイス、チリ等）

## 🚀 セットアップ

### 1. 前提条件

- Node.js 18以上
- Chrome ブラウザ
- Supabaseアカウント（無料プラン可）

### 2. プロジェクトのクローンとビルド

```bash
git clone <repository-url>
cd trade-lens
npm install
npm run build
```

### 3. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. プロジェクト設定から `Project URL` と `API Key` を取得
3. `.env.example` を `.env` にコピーして設定値を更新

```bash
cp .env.example .env
# .env を編集してSupabaseの認証情報を設定
```

### 4. データベースの初期化

Supabase SQL Editorで以下を順次実行：

```bash
# 基本スキーマとセキュリティ設定
database/schema.sql
database/security.sql
database/functions.sql

# サンプルデータ
database/sample_data.sql

# 拡張データ（オプション）
database/hs_codes_extended.sql
database/agreements_extended.sql  
database/tariff_rates_extended.sql
```

### 5. Chrome拡張機能の読み込み

1. Chrome で `chrome://extensions/` にアクセス
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」で `dist` フォルダを選択

## 🛠️ 開発コマンド

```bash
# 開発ビルド（ファイル監視）
npm run dev

# 本番ビルド
npm run build

# 拡張機能パッケージ化
npm run pack

# 型チェック
npm run typecheck
```

## 🏗️ プロジェクト構造

```
trade-lens/
├── public/
│   └── manifest.json          # 拡張機能設定
├── src/
│   ├── background/            # Service Worker
│   ├── content/               # コンテンツスクリプト
│   ├── popup/                 # ポップアップUI
│   ├── lib/                   # Supabase設定
│   ├── types/                 # TypeScript型定義
│   └── utils/                 # ユーティリティ
├── database/                  # データベーススキーマ・データ
│   ├── schema.sql            # テーブル定義
│   ├── security.sql          # RLSポリシー
│   ├── functions.sql         # ストアドファンクション
│   ├── sample_data.sql       # 基本データ
│   ├── hs_codes_extended.sql # 拡張HSコード
│   ├── agreements_extended.sql # 拡張協定データ
│   └── tariff_rates_extended.sql # 拡張関税率
├── dist/                     # ビルド出力
└── docs/                     # ドキュメント
```

## 📱 使用方法

1. Chromeツールバーの拡張機能アイコンをクリック
2. HSコードまたは商品名を入力して検索
3. 該当するHSコードを選択
4. 輸出国・輸入国・貿易金額を設定
5. 「関税最適化を実行」をクリック
6. 協定別の関税率と削減額を確認

## 📈 今後の開発ロードマップ

### Phase 1: データ拡充
- [ ] 主要1,000品目のHSコード追加
- [ ] 全FTA/EPA協定の網羅
- [ ] 実際の関税率データの充実

### Phase 2: 機能拡張
- [ ] 輸出入規制チェック機能
- [ ] 原産地証明書要件の詳細表示
- [ ] 検索履歴・お気に入り機能
- [ ] データエクスポート機能

### Phase 3: 高度な分析
- [ ] 関税率トレンド分析
- [ ] 最適輸送ルート提案
- [ ] コンプライアンスチェック
- [ ] 多言語対応

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## ⚠️ 免責事項

この拡張機能で提供される関税率情報は参考値です。実際の貿易取引では、必ず税関や通関業者に最新の情報をご確認ください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📞 お問い合わせ

- 問題報告: [GitHub Issues](../../issues)
- 機能要望: [GitHub Discussions](../../discussions)

---

**Trade Lens** - Made with ❤️ for international trade professionals