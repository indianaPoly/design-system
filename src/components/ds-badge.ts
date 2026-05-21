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

      /* Local variable bridging */
      --_bg: var(--ds-badge-bg, var(--ds-badge-neutral-bg, #f4f4f5));
      --_color: var(--ds-badge-color, var(--ds-badge-neutral-fg, #3f3f46));
      --_border-color: var(--ds-badge-border-color, var(--ds-badge-neutral-border, #e4e4e7));
      --_border: var(--ds-badge-border, 1px solid var(--_border-color));
      --_radius: var(--ds-badge-radius, 999px);
      --_padding-y: var(--ds-badge-padding-y, 6px);
      --_padding-x: var(--ds-badge-padding-x, 10px);
      --_font-size: var(--ds-badge-font-size, 0.75rem);
      --_gap: var(--ds-badge-gap, 6px);
      --_indicator-size: var(--ds-badge-indicator-size, 6px);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--_gap);
      min-height: 24px;
      padding: var(--_padding-y) var(--_padding-x);
      border-radius: var(--_radius);
      border: var(--_border);
      background: var(--_bg);
      color: var(--_color);
      font-size: var(--_font-size);
      font-weight: var(--ds-badge-font-weight, 700);
      letter-spacing: -0.01em;
      box-sizing: border-box;
      line-height: 1;
      white-space: nowrap;
    }

    .badge::before {
      content: '';
      width: var(--_indicator-size);
      height: var(--_indicator-size);
      border-radius: 999px;
      background: currentColor;
      opacity: 0.72;
    }

    :host([variant="primary"]) {
      --_bg: var(--ds-badge-primary-bg, var(--ds-color-primary, #111111));
      --_color: var(--ds-badge-primary-fg, var(--ds-color-on-primary, #ffffff));
      --_border-color: var(--ds-badge-primary-border, transparent);
    }

    :host([variant="success"]) {
      --_bg: var(--ds-badge-success-bg, #f5f5f5);
      --_color: var(--ds-badge-success-fg, #27272a);
      --_border-color: var(--ds-badge-success-border, #d4d4d8);
    }

    :host([variant="warning"]) {
      --_bg: var(--ds-badge-warning-bg, #fafafa);
      --_color: var(--ds-badge-warning-fg, #52525b);
      --_border-color: var(--ds-badge-warning-border, #d4d4d8);
    }

    :host([variant="danger"]) {
      --_bg: var(--ds-badge-danger-bg, #ededf0);
      --_color: var(--ds-badge-danger-fg, #18181b);
      --_border-color: var(--ds-badge-danger-border, #c7c7cc);
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
