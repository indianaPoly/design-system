import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

@customElement('ds-alert')
export class DsAlert extends LitElement {
  @property({ type: String, reflect: true })
  declare variant: AlertVariant;

  @property({ type: String })
  declare title: string;

  constructor() {
    super();
    this.variant = 'info';
    this.title = '';
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(
        --ds-alert-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
    }

    .alert {
      border-radius: var(--ds-alert-radius, var(--ds-radius-lg, 12px));
      padding: var(--ds-alert-padding-y, var(--ds-space-md, 12px))
        var(--ds-alert-padding-x, var(--ds-space-lg, 16px));
      border: 1px solid transparent;
      display: grid;
      gap: var(--ds-alert-gap, var(--ds-space-xs, 6px));
      background: var(--ds-alert-bg, var(--ds-color-surface-muted, #f9fafb));
      color: var(--ds-alert-text-color, var(--ds-color-text, #111827));
    }

    .title {
      font-weight: var(--ds-alert-title-weight, 700);
    }

    :host([variant="info"]) .alert {
      border-color: var(--ds-alert-info-border-color, rgba(37, 99, 235, 0.3));
      background: var(--ds-alert-info-bg, rgba(37, 99, 235, 0.1));
    }

    :host([variant="success"]) .alert {
      border-color: var(--ds-alert-success-border-color, rgba(22, 163, 74, 0.3));
      background: var(--ds-alert-success-bg, rgba(22, 163, 74, 0.12));
    }

    :host([variant="warning"]) .alert {
      border-color: var(--ds-alert-warning-border-color, rgba(245, 158, 11, 0.35));
      background: var(--ds-alert-warning-bg, rgba(245, 158, 11, 0.15));
    }

    :host([variant="danger"]) .alert {
      border-color: var(--ds-alert-danger-border-color, rgba(220, 38, 38, 0.35));
      background: var(--ds-alert-danger-bg, rgba(220, 38, 38, 0.12));
    }
  `;

  render() {
    return html`
      <section class="alert" part="alert" role="status">
        <strong class="title" part="title">
          <slot name="title">${this.title}</slot>
        </strong>
        <div class="body" part="body">
          <slot></slot>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-alert': DsAlert;
  }
}
