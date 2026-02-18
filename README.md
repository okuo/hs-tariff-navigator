# TariffScope - FTA/EPA関税最適化Chrome拡張機能

日本企業の貿易コスト削減を支援するChrome拡張機能です。HSコード検索とFTA/EPA協定の最適な関税率を自動判定し、削減額をシミュレーションします。

## 主な機能

- **HSコード検索**: 品目名またはコード番号から該当するHSコードを検索（88品目収録）
- **関税最適化**: 各国間のFTA/EPA協定を比較して最適な関税率を算出（20協定対応）
- **削減額シミュレーション**: 貿易額を入力するだけで協定別の削減額・削減率を即座に算出
- **原産地規則ガイド**: 推奨協定の原産地証明に必要な手続きを案内
- **HSコード自動検出**: 貿易関連サイト上でHSコードをハイライト表示
- **検索履歴**: 過去の検索条件を保存・再利用（最大50件）
- **エクスポート**: 結果をCSVダウンロード・クリップボードコピー
- **ダークモード**: システム設定連動またはワンクリック切替

## 対応FTA/EPA協定

RCEP、CPTPP（TPP11）、日EU EPA、日英EPA、日豪EPA、日米貿易協定、日ASEAN包括的経済連携、日中韓投資協定 など20協定

## セットアップ

### 前提条件

- Node.js 18以上
- Chrome ブラウザ

### インストールと開発

```bash
git clone https://github.com/okuo/hs-tariff-navigator.git
cd hs-tariff-navigator
npm install
npm run build
```

### Chrome拡張機能の読み込み

1. Chromeで `chrome://extensions/` にアクセス
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」で `dist` フォルダを選択

## 開発コマンド

```bash
npm run dev          # 開発ビルド（ファイル監視）
npm run build        # 本番ビルド
npm run type-check   # TypeScript型チェック
npm run lint         # ESLintチェック
npm run test         # テスト実行
npm run pack:zip     # CWS用zipパッケージ作成
```

## リリース

```bash
npm run release:patch  # パッチリリース (1.0.0 → 1.0.1)
npm run release:minor  # マイナーリリース (1.0.0 → 1.1.0)
npm run release:major  # メジャーリリース (1.0.0 → 2.0.0)
```

リリースコマンドは以下を自動実行します:
1. type-check + lint + test（品質ガード）
2. package.json + manifest.json のバージョン更新
3. git commit + tag + push
4. GitHub Actions: ビルド → GitHub Release作成 → Chrome Web Storeアップロード

## プロジェクト構成

```
hs-tariff-navigator/
├── public/
│   ├── manifest.json          # 拡張機能設定
│   ├── icons/                 # アイコン (16/48/128px)
│   └── data/                  # HSコード・協定・関税率データ (JSON)
├── src/
│   ├── background/            # Service Worker
│   ├── content/               # コンテンツスクリプト（HSコード検出）
│   ├── popup/                 # ポップアップUI（React）
│   ├── components/            # Reactコンポーネント
│   ├── lib/                   # データサービス・検索・関税最適化ロジック
│   ├── hooks/                 # カスタムフック
│   ├── types/                 # TypeScript型定義
│   └── utils/                 # 定数・ユーティリティ
├── scripts/                   # ビルド・リリースツール
├── database/                  # SQLスキーマ・サンプルデータ
├── docs/                      # ドキュメント
├── store-assets/              # CWSストア掲載用画像
└── .github/workflows/         # CI/CDパイプライン
```

## 技術スタック

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Build**: Webpack 5
- **Test**: Jest + Testing Library
- **CI/CD**: GitHub Actions → Chrome Web Store自動デプロイ
- **Extension**: Chrome Manifest V3

## ドキュメント

- [API リファレンス](docs/API.md)
- [プライバシーポリシー](docs/privacy-policy.md)

## 免責事項

この拡張機能で提供される関税率情報は参考値です。実際の貿易取引では、必ず税関等に最新の情報をご確認ください。

## ライセンス

MIT License
