import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

@customElement('ds-alert')
export class DsAlert extends LitElement {
  @property({ type: String, reflect: true })
  variant: AlertVariant = 'info';

  @property({ type: String })
  title = '';

  static styles = css`
    :host {
      display: block;
      font-family: var(--ds-font-family, "Inter", system-ui, sans-serif);
    }

    .alert {
      border-radius: var(--ds-radius-lg, 12px);
      padding: var(--ds-space-md, 12px) var(--ds-space-lg, 16px);
      border: 1px solid transparent;
      display: grid;
      gap: var(--ds-space-xs, 6px);
      background: var(--ds-color-surface-muted, #f9fafb);
      color: var(--ds-color-text, #111827);
    }

    .title {
      font-weight: 700;
    }

    :host([variant="info"]) .alert {
      border-color: rgba(37, 99, 235, 0.3);
      background: rgba(37, 99, 235, 0.1);
      color: var(--ds-color-text, #111827);
    }

    :host([variant="success"]) .alert {
      border-color: rgba(22, 163, 74, 0.3);
      background: rgba(22, 163, 74, 0.12);
      color: var(--ds-color-text, #111827);
    }

    :host([variant="warning"]) .alert {
      border-color: rgba(245, 158, 11, 0.35);
      background: rgba(245, 158, 11, 0.15);
      color: var(--ds-color-text, #111827);
    }

    :host([variant="danger"]) .alert {
      border-color: rgba(220, 38, 38, 0.35);
      background: rgba(220, 38, 38, 0.12);
      color: var(--ds-color-text, #111827);
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
