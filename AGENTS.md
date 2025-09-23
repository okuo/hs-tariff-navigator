# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the Chrome extension source in TypeScript; `background/`, `content/`, and `popup/` split service worker, injected scripts, and UI. Shared helpers live in `components/`, `lib/`, `services/`, `types/`, and `utils/`.
- `public/manifest.json` defines the extension bundle; keep static icons and HTML entry points here. Generated assets land in `dist/` after any webpack build—never edit files in `dist/` directly.
- `database/` tracks the Supabase schema, security policies, and seed data (`schema.sql`, `functions.sql`, etc.); apply these scripts through the Supabase SQL editor.
- `docs/` hosts onboarding references (`SETUP.md`, `API.md`, `TROUBLESHOOTING.md`). Update these when workflows change.

## Build, Test, and Development Commands
- `npm install` syncs dependencies; rerun after changing `package.json`.
- `npm run dev` launches webpack in watch mode, rebuilding `dist/` while you iterate.
- `npm run build` (or `npm run build:dev`) produces a production bundle; load this folder via `chrome://extensions` for manual QA.
- `npm run clean` removes the current build output.
- `npm run type-check` runs the strict TypeScript compiler, blocking structural regressions.
- `npm run lint` (and `npm run lint:fix`) applies the ESLint ruleset defined in `.eslintrc.js`.

## Coding Style & Naming Conventions
- Follow the existing two-space indentation and single-quote imports. React components (`src/components/*.tsx`, `src/popup/*.tsx`) use PascalCase file and symbol names; utility modules stay camelCase.
- Respect the `@/*` path alias configured in `tsconfig.json`; prefer it to relative traversal inside `src`.
- Keep Chrome API calls typed via the bundled `@types/chrome` definitions and centralize network access in `src/lib/` for reuse.

## Testing Guidelines
- The project currently relies on automated type and lint checks plus manual extension verification. Run `npm run dev`, reload the unpacked extension, and walk through the HS code search and tariff comparison flows before raising a PR.
- When adding logic-heavy modules, include targeted unit coverage using the stack of your choice (Jest or Vitest) and document the command in `package.json`.

## Commit & Pull Request Guidelines
- Create topic branches such as `feature/<scope>` or `fix/<issue>`; keep commits short, imperative, and scoped to a single concern (e.g., `Add tariff breakdown drawer`).
- PRs should reference related GitHub issues, list the Supabase scripts or UI areas touched, and note manual verification steps (extension install, API responses, screenshots when UI shifts).
- Update docs or SQL artifacts when behavior changes, and confirm `npm run lint` and `npm run type-check` pass before requesting review.

## Environment & Configuration
- Duplicate `.env.example` to `.env` with your Supabase `PROJECT_URL` and `SERVICE_ROLE_KEY`; never commit secrets. See `docs/SETUP.md` for connection details and `docs/TROUBLESHOOTING.md` for common Supabase errors.
- Keep schema adjustments in versioned SQL files under `database/` and coordinate releases so the deployed Supabase project matches the checked-in definitions.

## コミュニケーション方針
- Issue、Pull Request、レビューコメントを含むリポジトリに関するコミュニケーションは日本語で行ってください。


