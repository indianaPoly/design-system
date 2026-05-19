import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

@customElement('ds-alert')
export class DsAlert extends LitElement {
  @property({ type: String, reflect: true })
  declare variant: AlertVariant;

  @property({ type: String })
  declare title: string;

  @state()
  declare private hasTitleSlot: boolean;

  constructor() {
    super();
    this.variant = 'info';
    this.title = '';
    this.hasTitleSlot = false;
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
      position: relative;
      display: grid;
      gap: var(--ds-alert-gap, 6px);
      padding: var(--ds-alert-padding-y, 18px) var(--ds-alert-padding-x, 20px);
      padding-left: calc(var(--ds-alert-padding-x, 20px) + var(--ds-alert-indicator-size, 10px) + 12px);
      border-radius: var(--ds-alert-radius, var(--ds-radius-lg, 20px));
      border: 1px solid var(--ds-alert-border-color, var(--ds-color-border, #e4e4e7));
      background: var(--ds-alert-bg, var(--ds-color-surface-raised, #fcfcfc));
      color: var(--ds-alert-text-color, var(--ds-color-text, #111111));
      box-shadow: var(--ds-alert-shadow, 0 1px 2px rgba(17, 17, 17, 0.04));
      overflow: hidden;
      box-sizing: border-box;
    }

    .alert::before {
      content: '';
      position: absolute;
      top: 21px;
      left: var(--ds-alert-padding-x, 20px);
      width: var(--ds-alert-indicator-size, 10px);
      height: var(--ds-alert-indicator-size, 10px);
      border-radius: 999px;
      background: var(--ds-alert-info-accent, #111111);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--ds-alert-info-accent, #111111) 12%, transparent);
    }

    .title {
      font-size: 0.9375rem;
      font-weight: var(--ds-alert-title-weight, 700);
      letter-spacing: -0.01em;
      line-height: 1.35;
    }

    .body {
      color: var(--ds-color-muted, #6b7280);
      line-height: 1.55;
      font-size: 0.9375rem;
    }

    .title[hidden] {
      display: none;
    }

    :host([variant="info"]) .alert {
      border-color: var(--ds-alert-info-border-color, #e4e4e7);
      background: var(--ds-alert-info-bg, #fafafa);
    }

    :host([variant="info"]) .alert::before {
      background: var(--ds-alert-info-accent, #111111);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--ds-alert-info-accent, #111111) 12%, transparent);
    }

    :host([variant="success"]) .alert {
      border-color: var(--ds-alert-success-border-color, #d4d4d8);
      background: var(--ds-alert-success-bg, #f7f7f8);
    }

    :host([variant="success"]) .alert::before {
      background: var(--ds-alert-success-accent, #2f2f33);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--ds-alert-success-accent, #2f2f33) 12%, transparent);
    }

    :host([variant="warning"]) .alert {
      border-color: var(--ds-alert-warning-border-color, #d4d4d8);
      background: var(--ds-alert-warning-bg, #f4f4f5);
    }

    :host([variant="warning"]) .alert::before {
      background: var(--ds-alert-warning-accent, #52525b);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--ds-alert-warning-accent, #52525b) 14%, transparent);
    }

    :host([variant="danger"]) .alert {
      border-color: var(--ds-alert-danger-border-color, #c7c7cc);
      background: var(--ds-alert-danger-bg, #ededf0);
    }

    :host([variant="danger"]) .alert::before {
      background: var(--ds-alert-danger-accent, #27272a);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--ds-alert-danger-accent, #27272a) 12%, transparent);
    }
  `;

  private handleTitleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasTitleSlot = slot.assignedNodes({ flatten: true }).length > 0;
  }

  render() {
    const shouldShowTitle = Boolean(this.title) || this.hasTitleSlot;

    return html`
      <section class="alert" part="alert" role="status">
        <strong class="title" part="title" ?hidden=${!shouldShowTitle}>
          <slot name="title" @slotchange=${this.handleTitleSlotChange}>${this.title}</slot>
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
