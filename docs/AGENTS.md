# AGENTS.md

## Overview
Vite-powered preview (storybook substitute) for tokens + components.

## Where To Look
| Task | Location | Notes |
|------|----------|-------|
| Preview UI behavior | `docs/main.ts` | Renders selected component only (performance) |
| Preview markup/layout | `docs/index.html` | Containers required by `docs/main.ts` |
| Preview styling | `docs/styles.css` | Uses `--ds-*` tokens for theming |
| Dev/build config | `vite.docs.config.ts` | `base` differs between dev vs build |

## Conventions
- `docs/main.ts` imports `../src/styles/tokens.css` and `../src/index` to register all components.
- Keep DOM size low by rendering only the selected component definition.
- If you add/remove containers in `docs/index.html`, keep selectors in sync with `docs/main.ts` (it throws if missing).

## Gotchas
- Build output goes to `dist-docs/` and uses `base: '/design-system/'` in build mode.
