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
      justify-content: center;
      gap: var(--ds-badge-gap, 6px);
      min-height: 28px;
      padding: var(--ds-badge-padding-y, 6px) var(--ds-badge-padding-x, 10px);
      border-radius: var(--ds-badge-radius, 999px);
      border: 1px solid var(--ds-badge-neutral-border, #e4e4e7);
      background: var(--ds-badge-neutral-bg, #f4f4f5);
      color: var(--ds-badge-neutral-fg, #3f3f46);
      font-size: var(--ds-badge-font-size, 0.75rem);
      font-weight: var(--ds-badge-font-weight, 700);
      letter-spacing: -0.01em;
      box-sizing: border-box;
    }

    :host([variant="primary"]) .badge {
      border-color: var(--ds-badge-primary-border, transparent);
      background: var(--ds-badge-primary-bg, var(--ds-color-primary, #111111));
      color: var(--ds-badge-primary-fg, var(--ds-color-on-primary, #ffffff));
    }

    :host([variant="success"]) .badge {
      border-color: var(--ds-badge-success-border, #d4d4d8);
      background: var(--ds-badge-success-bg, #f5f5f5);
      color: var(--ds-badge-success-fg, #27272a);
    }

    :host([variant="warning"]) .badge {
      border-color: var(--ds-badge-warning-border, #d4d4d8);
      background: var(--ds-badge-warning-bg, #fafafa);
      color: var(--ds-badge-warning-fg, #52525b);
    }

    :host([variant="danger"]) .badge {
      border-color: var(--ds-badge-danger-border, #c7c7cc);
      background: var(--ds-badge-danger-bg, #ededf0);
      color: var(--ds-badge-danger-fg, #18181b);
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
