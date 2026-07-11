# TariffScope - FTA/EPA関税最適化Chrome拡張機能

日本企業の貿易コスト削減を支援するChrome拡張機能です。HSコード検索とFTA/EPA協定の最適な関税率を自動判定し、削減額をシミュレーションします。

## このアプリで解決できること

TariffScopeは、通関前の事前調査や社内検討で「まず何を確認すべきか」を素早く整理するためのツールです。

- 商品名やコードからHSコード候補を探し、調査の起点を作る
- 商品説明をChrome内蔵AIで検索語に整理し、候補検索の初動を早める
- 輸出国・輸入国の組み合わせから利用可能なFTA/EPA協定を比較する
- 貿易金額を入力して、協定適用時の削減額を概算する
- 推奨協定の原産地証明方式や必要書類を確認する
- 貿易関連サイト上のHSコードを検出し、調査にすぐつなげる

提供する関税率・協定情報は参考データです。実際の申告・契約・価格決定では、必ず税関、通関士、JETRO等の公式情報や専門家に確認してください。

## 主な機能

- **HSコード検索**: 品目名またはコード番号から該当するHSコードを検索（88品目収録）
- **Chrome内蔵AI検索補助**: Prompt API対応Chromeで商品説明を検索語に変換
- **関税最適化**: 各国間のFTA/EPA協定を比較して最適な関税率を算出（20協定対応）
- **データ根拠の表示**: 収録税率と参考推定を分けて表示し、未収録データを明示
- **削減額シミュレーション**: 貿易額を入力するだけで協定別の削減額・削減率を即座に算出
- **原産地規則ガイド**: 推奨協定の原産地証明に必要な手続きを案内
- **HSコード自動検出**: 貿易関連サイト上でHSコードをハイライト表示
- **検索履歴**: 過去の検索条件を保存・再利用（最大50件）
- **エクスポート**: 結果をCSVダウンロード・クリップボードコピー
- **ダークモード**: システム設定連動またはワンクリック切替

## 対応FTA/EPA協定

RCEP、CPTPP（TPP11）、日EU EPA、日英EPA、日豪EPA、日米貿易協定、日ASEAN包括的経済連携など20協定を収録しています。一部の未発効・交渉中協定はデータ上に保持していますが、最適化対象からは除外されます。

## 収録データの位置づけ

- HSコード: 88件
- FTA/EPA協定: 20件
- 関税率: 75件
- 原産地規則: 主要協定のガイド情報

データ未収録の組み合わせでは、結果画面に「参考推定」として表示します。参考推定は候補確認用であり、実務判断には使用しないでください。

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

### Chrome内蔵AI検索補助（任意）

商品説明から検索語を作成する機能は、ChromeのPrompt API（Gemini Nano）に対応した環境で利用できます。初回利用時はChromeが端末内モデルを準備するため時間がかかる場合があります。AIはHSコードや税率を断定せず、既存検索へ渡す語句の整理だけに使います。

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
- [改善計画](docs/IMPROVEMENT_PLAN.md)
- [リリースノート](docs/RELEASE_NOTES.md)
- [Chrome Web Store 掲載文案](docs/STORE_LISTING.md)
- [プライバシーポリシー](docs/privacy-policy.md)

## 免責事項

この拡張機能で提供される関税率情報は参考値です。実際の貿易取引では、必ず税関等に最新の情報をご確認ください。

## ライセンス

MIT License
