# AGENTS.md

## Overview
Lit Web Components (`ds-*`) live here; each file defines one component and registers its custom element.

## Where To Look
| Task | Location | Notes |
|------|----------|-------|
| Add a new component | `src/components/ds-<name>.ts` | Use `LitElement` + `@customElement('ds-...')` |
| Add/adjust public props | `@property({ ..., reflect: true })` fields | Keep attributes stable |
| Update styling tokens usage | `static styles = css\`` | Prefer `--ds-*` CSS variables with fallbacks |
| Export component/types | `src/index.ts` | Update exports when adding new components |

## Conventions
- Register tags with `@customElement('ds-...')` (decorator), not `customElements.define`.
- Use `@property({ type: <Type>, reflect: true }) declare ...` for public attributes.
- Set default values in the constructor.
- Provide `declare global { interface HTMLElementTagNameMap { ... } }` for tag typing.
- Use Lit `html` templates and `css` for `static styles`.
- For optional attributes, use `ifDefined(...)` rather than stringifying `undefined`.

## Anti-Patterns
- Renaming an existing `ds-*` tag (breaking change).
- Changing public attribute semantics without updating `tests/*.test.ts`.
- Removing `reflect: true` from attributes that are used via HTML.
