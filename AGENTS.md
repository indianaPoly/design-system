# AGENTS.md

## Mission
Produce PRs that are safe to merge, minimal in scope, and verified by local checks.
Prioritize correctness, stability, and maintainability. Avoid "garbage diffs."

---

## Non-negotiable Rules (Scope & Noise)
1) No cosmetic refactors unless explicitly requested:
   - formatting-only changes
   - mass rename / reorder imports across unrelated files
   - unrelated cleanup, dead code removal, file moves
2) One PR = one intent:
   - If scope grows, split into separate PRs (or revert unrelated changes).
3) Do not change public/shared APIs without:
   - tests
   - explicit migration notes (in PR description)
4) Do not assume CI will catch issues:
   - run required checks locally (or in the sandbox) before PR.

---

## Style Guide
### Frontend / JS/TS
- ESLint must follow Airbnb-style conventions.
- Prefer consistent patterns already present in the codebase.
- No opinionated rewrites (hooks refactors, component splitting, etc.) unless necessary for the request.

### Python
- Prefer explicit, readable code.
- Do not introduce heavy refactors unless required for correctness.
- Keep changes localized; avoid broad restructuring.

---

## PR Safety Workflow (Must Follow)
Before opening or updating a PR:

A) Sync with base branch
- Ensure the working branch is up-to-date with the target base branch (merge or rebase, per repo policy).

B) Run verification in strict order (stop on first failure)
1. static analysis (lint/format checks)
2. type/compile checks
3. tests
4. build

C) If build fails
- Fix minimally
- Re-run build
- Repeat until build succeeds

D) Only after successful build
- Prepare PR with a clear description + verification evidence.

If any step is not executed, clearly state: **NOT VERIFIED**.

---

## How to Choose Commands (Project-Aware)
Use the repo’s existing scripts/config first. Typical conventions:

### JS/TS / Frontend
- Install: `bun install` OR `pnpm install` OR `npm ci`
- Lint: `bun run lint` (or `pnpm lint` / `npm run lint`)
- Typecheck: `bun run typecheck` (or `tsc -p ...`)
- Test: `bun run test`
- Build: `bun run build`

### Python
- Install (preferred): `uv sync` OR `poetry install` OR `pip install -r requirements.txt`
- Lint/Format: `ruff check .` / `ruff format --check .` (or repo-standard)
- Typecheck: `mypy .` (if configured)
- Test: `pytest`
- Build/Package (if applicable): `python -m build` (if configured)

When multiple exist, prefer what the repo already uses.

---

## Output Requirements (When Responding in Slack)
When asked to implement or prepare a PR, produce:
1) Change summary (what/why)
2) Scope statement (what changed vs not changed)
3) Verification results (commands + pass/fail)
4) Risk assessment (low/medium/high) + rollback note if needed
5) PR-ready text (title + description)

---

## Project Snapshot (Repo-Specific)
### Overview
- Package: `@design-system/core` (ESM), built with Lit Web Components.
- Tooling: `bun` + `vite` (library build) + `vitest` (jsdom) + `eslint` (Airbnb).

### Structure
```
.
├── src/
│   ├── components/      # Lit components (ds-*)
│   ├── styles/          # CSS tokens
│   └── index.ts         # Public exports
├── tests/               # Vitest unit tests
└── docs/                # Vite preview (storybook substitute)
```

### Where To Look
| Task | Location |
|------|----------|
| Add/update a component | `src/components/*.ts` |
| Public exports / types | `src/index.ts` |
| Theme tokens | `src/styles/tokens.css` |
| Component tests | `tests/*.test.ts` |
| Library build config | `vite.config.ts` |
| Docs preview config | `vite.docs.config.ts`, `docs/*` |

### Commands
```bash
bun run lint
bun run typecheck
bun run test
bun run build
bun run docs:dev -- --host 0.0.0.0 --port 4173
bun run docs:build
```

### Local Conventions / Gotchas
- Components are registered via `@customElement('ds-...')`; tests must import the module to register the tag.
- Tests typically `document.body.innerHTML = '<ds-...>'`, then `await element.updateComplete`, then inspect `shadowRoot`.
- Docs preview builds to `dist-docs/` and uses `base: '/design-system/'` in `vite.docs.config.ts` for build mode.
