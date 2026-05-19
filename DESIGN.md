# Design

## Source of truth
- Status: Active draft
- Last refreshed: 2026-05-19
- Primary product surfaces:
  - `src/components/*`: Lit Web Components distributed as `@design-system/core`
  - `docs/*`: Vite preview and copy-paste examples
  - `tests/visual/*`: visual regression baselines for component combinations
- Evidence reviewed:
  - `src/styles/tokens.css` — token ownership and light/dark theme model
  - `src/components/ds-button.ts`, `ds-card.ts`, `ds-input.ts`, `ds-textarea.ts`, `ds-checkbox.ts`, `ds-radio.ts`, `ds-switch.ts`, `ds-badge.ts`, `ds-alert.ts` — current UI primitives
  - `docs/index.html`, `docs/main.ts`, `docs/styles.css` — preview experience
  - `docs/visual-regression.*`, `tests/visual/visual-regression.spec.ts` — visual snapshot surface
  - `SKILL.example.md` — consumer cookbook and worst-case usage guidance
  - External references: shadcn/ui introduction and blocks docs, Radix Themes component docs, Vercel Geist introduction

## Brand
- Personality: calm, developer-grade, modern SaaS utility; polished but not decorative.
- Trust signals: strong contrast, clear focus states, predictable spacing, visible examples, copy-ready code.
- Avoid: flat gray-only UI with no hierarchy, glassmorphism-heavy noise, novelty colors, hidden behavior, over-animated controls.

## Product goals
- Goals:
  - Make the preview feel like a real product UI, not a component dump.
  - Make every primitive look good out-of-the-box in light and dark themes.
  - Provide copy-paste blocks that service teams can adapt immediately.
  - Keep implementation framework-agnostic and token-driven.
- Non-goals:
  - Do not introduce React/Tailwind as runtime requirements.
  - Do not replace Lit components with shadcn/ui; use shadcn/ui as a distribution/quality reference only.
  - Do not add a new dependency for purely visual polish.
- Success signals:
  - A consumer can copy a block from docs and get a coherent screen section.
  - Visual snapshots show clear hierarchy across actions, forms, selection controls, and surfaces.
  - Existing lint/type/test/build checks pass.

## Personas and jobs
- Primary personas:
  - Product engineers who need consistent UI primitives without adopting a framework-specific library.
  - AI/coding-agent workflows that need clear, reusable examples and anti-pattern guidance.
- User jobs:
  - Install the package, register components, and build a service screen quickly.
  - Copy a complete section and adjust labels/data.
  - Verify a theme or component change did not visually regress.
- Key contexts of use:
  - Internal dashboards, admin tools, onboarding flows, settings forms, status surfaces.

## Information architecture
- Primary navigation:
  - Docs preview should lead with product-quality hero, then system principles, components, and copy-paste blocks.
- Core routes/screens:
  - `/` docs preview
  - `/visual-regression.html` snapshot target
- Content hierarchy:
  - What this system is for -> what it looks like -> how to copy a real block -> component details.

## Design principles
- Useful defaults first: each component should look production-ready with no custom CSS.
- Ownable code and examples: copy-paste blocks should use plain Web Component markup and local CSS variables.
- Structure beats decoration: use spacing, type, borders, and restrained color to make hierarchy obvious.
- Accessible polish: focus rings, contrast, target sizes, and state feedback are part of the visual style.
- Dark mode parity: dark theme must feel intentionally designed, not inverted.
- Tradeoffs:
  - Prefer a compact, shadcn-like density over oversized mobile-only controls, while preserving touch-safe heights.
  - Add restrained semantic color for status clarity rather than staying purely monochrome.

## Visual language
- Color:
  - Neutral zinc/slate base for text, surfaces, and borders.
  - Indigo/blue accent for product energy and focus without overwhelming default components.
  - Semantic green/amber/red only for success/warning/danger states.
- Typography:
  - System sans stack with tight headings, medium labels, and readable body line-height.
  - Mono styling only for code/token values.
- Spacing/layout rhythm:
  - 4px base increments; 12/16/24/32px are primary section steps.
  - Preview pages use responsive grids and code cards rather than one-off dropdown-only demos.
- Shape/radius/elevation:
  - 10-16px controls, 20-28px panels, subtle shadows with visible borders.
  - Elevation should separate surfaces but not create floating bubbles everywhere.
- Motion:
  - Short, functional transitions for hover/focus/active; disable motion in visual tests.
- Imagery/iconography:
  - No icon dependency. Use simple text markers/dots where needed.

## Components
- Existing components to reuse:
  - `ds-button`, `ds-card`, `ds-input`, `ds-textarea`, `ds-checkbox`, `ds-radio`, `ds-switch`, `ds-badge`, `ds-alert`
- New/changed components:
  - No new runtime component required for this pass.
  - Docs preview can add copy block cards using native HTML/CSS.
- Variants and states:
  - Buttons: primary, secondary, ghost; hover/focus/active/disabled must be visually distinct.
  - Forms: helper/error/counter/adornment states must be clear.
  - Status: badges and alerts should use semantic color accents.
  - Cards: header/body/footer should feel like a reusable app surface.
- Token/component ownership:
  - Global color, radius, shadow, spacing live in `src/styles/tokens.css`.
  - Component geometry and state styling stay component-local but tokenized.

## Accessibility
- Target standard: WCAG 2.2 AA intent for contrast and keyboard operation.
- Keyboard/focus behavior:
  - Native controls inside Shadow DOM keep keyboard behavior.
  - Focus rings must be visible in light and dark themes.
- Contrast/readability:
  - Text and interactive state contrast must not rely only on pastel backgrounds.
- Screen-reader semantics:
  - Maintain labels, required indicators, `aria-invalid`, `aria-describedby`, status roles.
- Reduced motion and sensory considerations:
  - Transitions should be short and non-essential; visual tests disable animation.

## Responsive behavior
- Supported breakpoints/devices:
  - Desktop docs preview first, with tablet/mobile grid collapse below ~900px and ~720px.
- Layout adaptations:
  - Component and block preview cards stack on small screens.
  - Code cards must remain horizontally scrollable rather than clipping content.
- Touch/hover differences:
  - Controls keep at least ~40-44px interaction height unless explicitly compact.

## Interaction states
- Loading:
  - Not a runtime primitive yet; examples may use disabled buttons for pending states.
- Empty:
  - Use muted text and bordered surfaces.
- Error:
  - Use semantic danger token, clear message, and visible border/focus treatment.
- Success:
  - Use semantic success token for badges/alerts; avoid green overload.
- Disabled:
  - Reduce opacity and remove strong shadows while preserving layout.
- Offline/slow network:
  - Out of scope for primitives; show with alert/card blocks when needed.

## Content voice
- Tone: direct, practical, Korean-first docs with short labels and real product copy.
- Terminology:
  - “컴포넌트”, “복붙 블록”, “토큰”, “상태”, “FormData”.
- Microcopy rules:
  - Examples should describe concrete tasks, not lorem ipsum.
  - Code snippets should be copyable with minimal hidden assumptions.

## Implementation constraints
- Framework/styling system:
  - Lit Web Components, ESM, Vite docs preview, Vitest, Playwright visual snapshots.
- Design-token constraints:
  - No hard-coded app-specific CSS in components when a token already exists.
  - Keep dark and iOS platform overrides in `tokens.css`.
- Performance constraints:
  - Docs preview should render useful examples without adding heavy dependencies.
- Compatibility constraints:
  - Preserve public component names, existing props, form behavior, and tests unless explicitly changed.
- Test/screenshot expectations:
  - Run lint -> typecheck -> tests -> build, plus docs build and visual tests for visual changes.

## Open questions
- [ ] Should the package eventually expose a registry/CLI install flow similar to shadcn/ui, or is copy-paste documentation enough for now? / owner: maintainer / impact: distribution model
- [ ] Should semantic status colors be brand-approved or remain default design-system values? / owner: maintainer / impact: token stability
