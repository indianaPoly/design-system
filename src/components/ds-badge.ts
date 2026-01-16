import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

@customElement('ds-badge')
export class DsBadge extends LitElement {
  @property({ type: String, reflect: true })
  declare variant: BadgeVariant;

  constructor() {
    super();
    this.variant = 'neutral';
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(
        --ds-badge-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-badge-gap, 4px);
      padding: var(--ds-badge-padding-y, 2px) var(--ds-badge-padding-x, 8px);
      border-radius: var(--ds-badge-radius, 999px);
      font-size: var(--ds-badge-font-size, 0.75rem);
      font-weight: var(--ds-badge-font-weight, 600);
      background: var(--ds-badge-neutral-bg, var(--ds-color-surface-muted, #f3f4f6));
      color: var(--ds-badge-neutral-fg, var(--ds-color-text, #111827));
    }

    :host([variant="primary"]) .badge {
      background: var(--ds-badge-primary-bg, var(--ds-color-primary, #2563eb));
      color: var(--ds-badge-primary-fg, var(--ds-color-on-primary, #ffffff));
    }

    :host([variant="success"]) .badge {
      background: var(--ds-badge-success-bg, var(--ds-color-success, #16a34a));
      color: var(--ds-badge-success-fg, var(--ds-color-on-success, #ffffff));
    }

    :host([variant="warning"]) .badge {
      background: var(--ds-badge-warning-bg, var(--ds-color-warning, #f59e0b));
      color: var(--ds-badge-warning-fg, var(--ds-color-on-warning, #111827));
    }

    :host([variant="danger"]) .badge {
      background: var(--ds-badge-danger-bg, var(--ds-color-danger, #dc2626));
      color: var(--ds-badge-danger-fg, var(--ds-color-on-danger, #ffffff));
    }
  `;

  render() {
    return html`<span class="badge" part="badge"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-badge': DsBadge;
  }
}
