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
      font-family: var(--ds-font-family, "Inter", system-ui, sans-serif);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--ds-color-surface-muted, #f3f4f6);
      color: var(--ds-color-text, #111827);
    }

    :host([variant="primary"]) .badge {
      background: var(--ds-color-primary, #2563eb);
      color: var(--ds-color-on-primary, #ffffff);
    }

    :host([variant="success"]) .badge {
      background: var(--ds-color-success, #16a34a);
      color: var(--ds-color-on-success, #ffffff);
    }

    :host([variant="warning"]) .badge {
      background: var(--ds-color-warning, #f59e0b);
      color: var(--ds-color-on-warning, #111827);
    }

    :host([variant="danger"]) .badge {
      background: var(--ds-color-danger, #dc2626);
      color: var(--ds-color-on-danger, #ffffff);
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
