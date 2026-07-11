# データ・ストレージ基盤リファクタリング設計

## 目的

TariffScope の同梱／リモートデータ取得、キャッシュ、検索履歴保存を明確な境界へ分離し、更新失敗や Chrome API 非依存環境を自動テストできるようにする。表示仕様と関税計算結果は変更しない。

## 対象範囲

- `chrome.storage.local` と `localStorage` の共通アダプター
- 検索履歴の保存・取得・削除処理の一本化
- データ型、参照情報、データソース、キャッシュ、リポジトリの分離
- リモート更新が有効な場合の「リモート優先、同梱フォールバック」
- `DataService` の再読み込みとロード失敗後の再試行
- Popup API と Background Service Worker の共有契約への移行

UI コンポーネントの分割、検索 API のエラー表現変更、Chrome AI 関連コードは対象外とする。

## アーキテクチャ

`src/lib/storage.ts` は実行環境の差だけを吸収する `KeyValueStorage` を提供する。検索履歴は `src/lib/searchHistoryRepository.ts` に集約し、Popup と Background の双方が同じ保存形式を使う。

データ層は `src/lib/data/` 配下へ分割する。`types.ts` が JSON 契約、`reference.ts` が出典情報の純粋変換、`cache.ts` が保存、`sources.ts` が同梱／リモート取得、`repository.ts` が取得順序とメモリキャッシュを担当する。既存の `src/lib/dataService.ts` は公開 API を保つ互換ファサードとする。

## データ取得フロー

1. 強制更新でなければ有効な永続キャッシュを返す。
2. 同梱データと同梱 manifest を読み込む。
3. manifest でリモート更新が有効ならリモートデータを試す。
4. リモート取得に失敗した場合は同梱データへフォールバックする。
5. 採用したデータを永続キャッシュと `DataService` のメモリへ保存する。

## エラー処理

- キャッシュの読み書き失敗はデータ取得自体を妨げない。
- 同梱データ取得に失敗し、利用可能なリモート設定もない場合は日本語のデータ読込エラーを投げる。
- `DataService` の共有中 Promise は成功・失敗を問わずクリアし、次回呼び出しで再試行可能にする。
- リモート失敗時に同梱データを返した事実は console warning に残すが、既存 UI の返却型は変えない。

## 型契約

- JSON 条件値には再帰的な `JsonValue` を使用し、プロダクションコードの `any` を除去する。
- `SearchHistoryEntry` を唯一の履歴保存形式とし、日時フィールドは `created_at` に統一する。
- Background メッセージは `type` を判別キーとする union にする。

## テスト方針

- ストレージアダプターは Chrome Storage と localStorage の両方を検証する。
- 履歴リポジトリは最大50件、降順保存、削除を検証する。
- データリポジトリはキャッシュ優先、リモート優先、同梱フォールバックを検証する。
- `DataService` は同時ロード共有、refresh 後のメモリ保持、失敗後の再試行を検証する。
- 最終的に型チェック、ESLint、Jest、production build を実行する。

## 非機能要件

- 新しい実行時依存パッケージは追加しない。
- Manifest V3 と Chrome 18+ 開発環境の既存挙動を維持する。
- `src/lib/dataService.ts` の既存 export は互換性を保つ。
- ユーザーの未コミット UI 変更には触れない。
