# Trade Lens Database Setup

## セットアップ手順

### 1. Supabaseダッシュボードにアクセス
1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. `trade-lens` プロジェクトを選択

### 2. データベーススキーマ作成
左側メニューの「**SQL Editor**」をクリックし、以下の順序でSQLファイルを実行：

#### ステップ1: スキーマ作成
`schema.sql` の内容をコピー＆ペーストして実行
- HSコードマスターテーブル
- FTA/EPA協定マスターテーブル  
- 関税率テーブル
- 検索履歴テーブル
- インデックス作成

#### ステップ2: セキュリティポリシー設定
`security.sql` の内容をコピー＆ペーストして実行
- RLS (Row Level Security) 有効化
- 読み取り・書き込みポリシー設定

#### ステップ3: ストアドファンクション作成
`functions.sql` の内容をコピー＆ペーストして実行
- HSコード検索関数
- 関税最適化関数
- 国別協定検索関数

#### ステップ4: サンプルデータ投入
`sample_data.sql` の内容をコピー＆ペーストして実行
- HSコードサンプルデータ
- FTA/EPA協定データ
- 関税率データ

### 3. 動作確認

以下のクエリで動作確認：

```sql
-- HSコード検索テスト
SELECT * FROM search_hs_codes('電池', 5);

-- 関税最適化テスト
SELECT optimize_tariff('8507100000', 'JP', 'CN', 1000000);

-- 協定検索テスト
SELECT * FROM get_agreements_by_countries('JP', 'AU');
```

### 4. 拡張機能テスト

1. Chrome拡張機能を再読み込み
2. ポップアップで「電池」等を検索
3. 関税最適化を実行
4. 結果が正常に表示されることを確認

## ファイル構成

```
database/
├── schema.sql      # テーブル定義・インデックス
├── security.sql    # RLSポリシー設定
├── functions.sql   # ストアドファンクション
├── sample_data.sql # サンプルデータ
└── README.md      # この手順書
```

## 注意事項

- SQLファイルは順序通りに実行してください
- エラーが発生した場合は、前のステップを確認してください
- サンプルデータは開発・テスト用です。本番環境では実際のデータに置き換えてください