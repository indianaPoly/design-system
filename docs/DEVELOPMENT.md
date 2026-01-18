# Design System Core – Development Guide

This repository contains framework-agnostic UI components built with Lit Web Components.

## Repository Structure

- `src/styles/tokens.css`: Design tokens (colors, spacing, radii, component tokens)
- `src/components/*.ts`: Lit components (`ds-*`)
- `src/index.ts`: Public exports (components + exported types)
- `tests/*.test.ts`: Vitest + jsdom unit tests (one file per component)
- `docs/`: Vite preview (storybook substitute)

## Local Commands

From `package.json`:

- Install: `bun install`
- Lint: `bun run lint`
- Typecheck: `bun run typecheck`
- Tests: `bun run test`
- Build (library): `bun run build`
- Docs dev: `bun run docs:dev`
- Docs build: `bun run docs:build`

## Theming & Platform Overrides

Tokens are CSS custom properties defined in `src/styles/tokens.css`.

### Global switches

Theme and platform are controlled via attributes on the root element (`<html>` recommended):

- Dark theme: `data-ds-theme="dark"`
- iOS platform: `data-ds-platform="ios"`

Example:

```html
<html data-ds-theme="dark" data-ds-platform="ios">
```

### Override precedence

We rely on CSS selector specificity:

- Base: `:root { ... }`
- Dark: `:root[data-ds-theme="dark"] { ... }`
- iOS: `:root[data-ds-platform="ios"] { ... }`
- iOS + Dark: `:root[data-ds-platform="ios"][data-ds-theme="dark"] { ... }`

More specific selectors win.

### Token layering strategy

- Base semantic tokens: `--ds-color-*`, `--ds-space-*`, `--ds-radius-*`
- Component tokens: `--ds-<component>-*` (e.g. `--ds-button-*`, `--ds-input-*`)

Components typically consume `--ds-<component>-*` first and fall back to semantic tokens.

## Component Catalog

All components are exported from `src/index.ts`.

### `ds-button`

- File: `src/components/ds-button.ts`
- Attributes/props:
  - `variant`: `"primary" | "secondary" | "ghost"` (reflected)
  - `size`: `"sm" | "md" | "lg"` (reflected)
  - `disabled`: `boolean` (reflected)
- Parts:
  - `button`
- Notes:
  - Uses token-driven styling (`--ds-button-*`)
  - Transition can be customized via `--ds-button-transition`

### `ds-card`

- File: `src/components/ds-card.ts`
- Attributes/props:
  - `elevation`: `number` (reflected)
- Slots:
  - `header` (named)
  - default (body)
  - `footer` (named)
- Parts:
  - `card`, `header`, `body`, `footer`
- Notes:
  - Token-driven styling (`--ds-card-*`)

### `ds-input`

- File: `src/components/ds-input.ts`
- Attributes/props:
  - `label`, `helper`, `error`, `value`, `placeholder`, `name`, `autocomplete`, `min`, `max`, `step`
  - `type`: `"text" | "email" | "password" | "search" | "tel" | "url" | "number"`
  - `disabled`, `required`, `readonly` (reflected)
- Events:
  - re-dispatches `input` and `change` from the host (bubbles + composed)
- Parts:
  - `field`, `label`, `input`, `message`

### `ds-textarea`

- File: `src/components/ds-textarea.ts`
- Attributes/props:
  - `label`, `helper`, `error`, `value`, `placeholder`, `name`
  - `rows`: `number`
  - `maxLength`: `number | undefined`
  - `disabled`, `required`, `readonly` (reflected)
- Events:
  - re-dispatches `input` and `change` from the host
- Parts:
  - `field`, `label`, `textarea`, `message`

### `ds-checkbox`

- File: `src/components/ds-checkbox.ts`
- Attributes/props:
  - `checked`: `boolean` (reflected)
  - `disabled`: `boolean` (reflected)
  - `name`: `string`
  - `value`: `string`
- Events:
  - re-dispatches `change` from the host
- Parts:
  - `label`, `checkbox`, `text`

### `ds-radio`

- File: `src/components/ds-radio.ts`
- Attributes/props:
  - `checked`: `boolean` (reflected)
  - `disabled`: `boolean` (reflected)
  - `name`: `string`
  - `value`: `string`
- Events:
  - re-dispatches `change` from the host
- Parts:
  - `label`, `radio`, `text`

### `ds-switch`

- File: `src/components/ds-switch.ts`
- Attributes/props:
  - `checked`: `boolean` (reflected)
  - `disabled`: `boolean` (reflected)
  - `name`: `string`
  - `value`: `string`
- Events:
  - re-dispatches `change` from the host
- Parts:
  - `label`, `track`, `thumb`, `switch`, `text`

### `ds-badge`

- File: `src/components/ds-badge.ts`
- Attributes/props:
  - `variant`: `"neutral" | "primary" | "success" | "warning" | "danger"` (reflected)
- Parts:
  - `badge`

### `ds-alert`

- File: `src/components/ds-alert.ts`
- Attributes/props:
  - `variant`: `"info" | "success" | "warning" | "danger"` (reflected)
  - `title`: `string`
- Slots:
  - `title` (named, defaults to `title` prop)
  - default (body)
- Parts:
  - `alert`, `title`, `body`

## Component Authoring Guide

This section describes how to add or modify components in `src/components/`.

### 1) File & tag naming

- One file per component: `src/components/ds-<name>.ts`
- Register with `@customElement('ds-<name>')`
- Do not rename existing tags (breaking change)

### 2) Public API (props/attributes)

- Use `@property({ type: ..., reflect: true })` when the attribute must be settable via HTML.
- Keep attribute semantics stable (tests assume current behavior).
- Initialize defaults in `constructor()`.

### 3) Rendering & Lit patterns

- Use `render()` with Lit `html` template.
- For optional attributes, use `ifDefined(...)` rather than passing empty strings.
- Await `updateComplete` in tests before reading `shadowRoot`.

### 4) Styling & tokens

- Prefer component tokens (`--ds-<component>-*`) with fallbacks to semantic tokens.
- Keep styles scoped inside `static styles = css\``.
- Expose stable styling hooks via `part="..."`.

Recommended pattern:

```ts
static styles = css`
  :host { font-family: var(--ds-<component>-font-family, var(--ds-font-family)); }
  .root { background: var(--ds-<component>-bg, var(--ds-color-surface)); }
`;
```

### 5) Events

When wrapping native controls (input/textarea/checkbox/etc):

- Stop propagation from the inner element, update component state, then re-dispatch a host event.
- Use `{ bubbles: true, composed: true }` so frameworks can listen outside shadow DOM.

### 6) Tests

- Add/adjust tests under `tests/ds-<name>.test.ts`.
- Import the module first to ensure the custom element is registered.
- Prefer focused DOM assertions over snapshots.

## Docs Preview

- Entry: `docs/main.ts` imports `../src/styles/tokens.css` and `../src/index`.
- A theme toggle is available in the preview UI:
  - It toggles `data-ds-theme="dark"` on `document.documentElement`.
  - Persists to `localStorage` under `ds-theme`.
