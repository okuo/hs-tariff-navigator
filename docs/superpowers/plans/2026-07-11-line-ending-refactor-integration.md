# Line Ending and Refactor Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** CRLFによる不要差分をLFへ正規化し、`codex/refactor-foundations` をv1.3.0系の最新コミットへ安全に統合する。

**Architecture:** `.gitattributes` を改行コードの正本とし、既存CRLFファイルを一括でLFへ戻す。正規化コミットを基点にリファクタリングブランチをrebaseし、検証成功後に追跡ブランチへfast-forward統合する。

**Tech Stack:** Git、TypeScript、Jest、ESLint、Webpack

## Global Constraints

- リモートへpushしない。
- `codex-tariff-evidence-checklist` と `codex/refactor-foundations` 以外のブランチを変更しない。
- アプリケーションの内容変更は行わず、改行正規化と既存リファクタリングの統合だけを行う。
- rebaseまたは検証が失敗した場合はローカル統合を行わない。

---

### Task 1: LF正規化

**Files:**
- Create: `.gitattributes`
- Normalize: `git ls-files --eol` で `i/crlf` と表示される追跡テキストファイル

**Interfaces:**
- Produces: 追跡テキストをLFで保存するGit属性
- Produces: `git diff --check` が成功する正規化コミット

- [ ] **Step 1: 現在の失敗を再確認する**

Run: `git diff --check c57bc25..HEAD`
Expected: CRLF化されたファイルで `trailing whitespace` を検出する。

- [ ] **Step 2: LFを正本とする属性を追加する**

```gitattributes
* text=auto eol=lf
*.md whitespace=-blank-at-eol
*.png binary
*.zip binary
```

- [ ] **Step 3: `i/crlf` の32ファイルをLFへ機械変換する**

Run:

```bash
perl -pi -e 's/\r$//' .env.example .eslintrc.js .github/workflows/ci.yml .gitignore AGENTS.md CLAUDE.md database/README.md database/README_extended.md database/agreements_extended.sql database/data_update.sql database/functions.sql database/hs_codes_extended.sql database/sample_data.sql database/schema.sql database/security.sql database/tariff_rates_extended.sql docs/SETUP.md docs/TROUBLESHOOTING.md public/data/agreements.json public/data/hs_codes.json public/data/origin_rules.json public/data/tariff_rates.json scripts/sync-version.js src/components/SearchHistory.tsx src/components/Toast.tsx src/hooks/useToast.ts src/lib/__tests__/dataService.test.ts src/popup/popup.html src/test/mocks/chrome.ts src/test/setup.ts tailwind.config.js tsconfig.json
```
Expected: 対象ファイルの内容は同一で、行末のみLFになる。

- [ ] **Step 3a: 正規化で露出したSQLの非意味的な末尾空白を除去する**

Run:

```bash
perl -pi -e 's/[ \t]+$//' database/agreements_extended.sql database/data_update.sql database/functions.sql database/hs_codes_extended.sql database/sample_data.sql database/schema.sql database/security.sql database/tariff_rates_extended.sql
```

Expected: SQLトークンと改行位置は同一で、行末の空白だけがなくなる。

- [ ] **Step 4: 属性と正規化内容をステージする**

```bash
git add .gitattributes docs/superpowers/plans/2026-07-11-line-ending-refactor-integration.md
git add --renormalize .
```

- [ ] **Step 5: 正規化を検証する**

Run: `git ls-files --eol`
Expected: 追跡テキストに `i/crlf` が残らない。

Run: `git diff --check c57bc25..HEAD`
Expected: exit 0、出力なし。

- [ ] **Step 6: 正規化をコミットする**

```bash
git commit -m "chore: 改行コードをLFに統一"
```

### Task 2: リファクタリングブランチのrebase

**Files:**
- Rebase: `codex/refactor-foundations`
- Potential conflict: `src/lib/__tests__/dataService.test.ts`

**Interfaces:**
- Consumes: Task 1のLF正規化コミット
- Produces: v1.3.0とChrome内蔵AI変更を含むリファクタリングブランチ

- [ ] **Step 1: 両作業ツリーがクリーンであることを確認する**

Run: `git status --short`
Expected: 両方の作業ツリーで出力なし。

- [ ] **Step 2: リファクタリングブランチを最新基点へrebaseする**

Run: `git rebase codex-tariff-evidence-checklist`
Expected: rebase成功。競合時はv1.3.0側の既存テストとリファクタリング側の`checkForUpdates`テストを両方残す。

- [ ] **Step 3: rebase後の全検証を実行する**

Run: `npm run type-check`
Expected: exit 0。

Run: `npm run lint`
Expected: エラー0。

Run: `npm test -- --runInBand`
Expected: 全テスト成功。

Run: `npm run build`
Expected: webpack exit 0。

### Task 3: ローカル統合

**Files:**
- Fast-forward: `codex-tariff-evidence-checklist`

**Interfaces:**
- Consumes: 検証済み `codex/refactor-foundations`
- Produces: 改行正規化とリファクタリングを含むローカル追跡ブランチ

- [ ] **Step 1: fast-forward可能であることを確認する**

Run: `git merge-base --is-ancestor codex-tariff-evidence-checklist codex/refactor-foundations`
Expected: exit 0。

- [ ] **Step 2: リファクタリングブランチをfast-forward統合する**

Run: `git merge --ff-only codex/refactor-foundations`
Expected: fast-forward成功。

- [ ] **Step 3: 統合後の全検証を再実行する**

Run: `npm run type-check && npm run lint && npm test -- --runInBand && npm run build`
Expected: 全コマンドexit 0。

- [ ] **Step 4: リモートとの差を確認する**

Run: `git status --short && git rev-list --left-right --count HEAD...origin/codex-tariff-evidence-checklist`
Expected: 作業ツリーはクリーン。ローカルは正規化・リファクタリング分だけaheadになる。
