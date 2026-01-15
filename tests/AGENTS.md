# AGENTS.md

## Overview
Vitest + jsdom unit tests for Lit components.

## Where To Look
| Task | Location | Notes |
|------|----------|-------|
| Add a test for a component | `tests/ds-<name>.test.ts` | One file per component |
| Common assertions | `shadowRoot?.querySelector(...)` | Verify rendered output/attributes |

## Conventions
- Import the component module first (e.g. `import { DsButton } from '../src/components/ds-button';`) so `@customElement(...)` runs.
- Render via `document.body.innerHTML = '<ds-...>'`.
- `await element.updateComplete` before querying `shadowRoot`.
- Prefer focused DOM assertions over snapshots.

## Anti-Patterns
- Forgetting to import the component module (tag not registered).
- Asserting before `updateComplete` (flaky tests).
