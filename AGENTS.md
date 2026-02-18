# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the Chrome extension source in TypeScript; `background/`, `content/`, and `popup/` split service worker, injected scripts, and UI. Shared helpers live in `components/`, `lib/`, `hooks/`, `types/`, and `utils/`.
- `public/manifest.json` defines the extension bundle (Manifest V3). `public/data/` contains the HSコード・協定・関税率 JSON data files. `public/icons/` contains extension icons.
- Generated assets land in `dist/` after any webpack build—never edit files in `dist/` directly.
- `scripts/` contains build and release tooling (version sync, store asset generation).
- `docs/` hosts API reference, privacy policy, and other documentation.

## Build, Test, and Development Commands
- `npm install` syncs dependencies; rerun after changing `package.json`.
- `npm run dev` launches webpack in watch mode, rebuilding `dist/` while you iterate.
- `npm run build` produces a production bundle; load `dist/` folder via `chrome://extensions` for manual QA.
- `npm run clean` removes the current build output.
- `npm run type-check` runs the strict TypeScript compiler.
- `npm run lint` (and `npm run lint:fix`) applies the ESLint ruleset.
- `npm test` runs Jest test suites.
- `npm run pack:zip` creates a CWS-ready zip package.
- `npm run release:patch` / `release:minor` / `release:major` runs full release pipeline.

## Coding Style & Naming Conventions
- Follow the existing two-space indentation and single-quote imports. React components use PascalCase; utility modules use camelCase.
- Respect the `@/*` path alias configured in `tsconfig.json`; prefer it to relative traversal inside `src`.
- Keep Chrome API calls typed via the bundled `@types/chrome` definitions and centralize data access in `src/lib/`.

## Testing Guidelines
- Jest test suites are in `src/lib/__tests__/`. Run with `npm test`.
- Chrome API mocks are in `src/test/mocks/chrome.ts`.
- Run `npm run type-check && npm run lint && npm test` before raising a PR.

## Commit & Pull Request Guidelines
- Create topic branches such as `feature/<scope>` or `fix/<issue>`.
- Keep commits short, imperative, and scoped to a single concern.
- PRs should pass CI (type-check, lint, test, build) before merge.

## Environment & Configuration
- No external database or API keys are required for development.
- Data files are bundled in `public/data/` as JSON.
- `.env` is only needed for optional configuration (see `.env.example`).
- Never commit secrets. CWS deployment credentials are stored in GitHub Secrets.

## コミュニケーション方針
- Issue、Pull Request、レビューコメントを含むリポジトリに関するコミュニケーションは日本語で行ってください。
