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

      /* Local variable bridging */
      --_padding-y: var(--ds-alert-padding-y, 18px);
      --_padding-x: var(--ds-alert-padding-x, 20px);
      --_gap: var(--ds-alert-gap, 6px);
      --_radius: var(--ds-alert-radius, var(--ds-radius-lg, 20px));
      --_indicator-size: var(--ds-alert-indicator-size, 10px);
      --_indicator-offset: var(--ds-alert-indicator-offset, 21px);
      --_border-color: var(--ds-alert-border-color, var(--ds-color-border, #e4e4e7));
      --_border: var(--ds-alert-border, 1px solid var(--_border-color));
      --_bg: var(--ds-alert-bg, var(--ds-color-surface-raised, #fcfcfc));
      --_color: var(--ds-alert-text-color, var(--ds-color-text, #111111));
      --_shadow: var(--ds-alert-shadow, 0 1px 2px rgba(17, 17, 17, 0.04));
      --_accent: var(--ds-alert-accent, #111111);
    }

    .alert {
      position: relative;
      display: grid;
      gap: var(--_gap);
      padding: var(--_padding-y) var(--_padding-x);
      padding-left: calc(var(--_padding-x) + var(--_indicator-size) + 12px);
      border-radius: var(--_radius);
      border: var(--_border);
      background: var(--_bg);
      color: var(--_color);
      box-shadow: var(--_shadow);
      overflow: hidden;
      box-sizing: border-box;
    }

    .alert::before {
      content: '';
      position: absolute;
      top: var(--_indicator-offset);
      left: var(--_padding-x);
      width: var(--_indicator-size);
      height: var(--_indicator-size);
      border-radius: 999px;
      background: var(--_accent);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--_accent) 12%, transparent);
    }

    .title {
      font-size: 0.9375rem;
      font-weight: var(--ds-alert-title-weight, 700);
      letter-spacing: -0.01em;
      line-height: 1.35;
    }

    .body {
      color: var(--ds-alert-body-color, var(--ds-color-muted, #6b7280));
      line-height: 1.55;
      font-size: 0.9375rem;
    }

    .title[hidden] {
      display: none;
    }

    :host([variant="info"]) {
      --_accent: var(--ds-alert-info-accent, #111111);
      --_bg: var(--ds-alert-info-bg, #fafafa);
      --_border-color: var(--ds-alert-info-border-color, var(--ds-alert-border-color, #e4e4e7));
    }

    :host([variant="success"]) {
      --_accent: var(--ds-alert-success-accent, #2f2f33);
      --_bg: var(--ds-alert-success-bg, #f7f7f8);
      --_border-color: var(--ds-alert-success-border-color, var(--ds-alert-border-color, #d4d4d8));
    }

    :host([variant="warning"]) {
      --_accent: var(--ds-alert-warning-accent, #52525b);
      --_bg: var(--ds-alert-warning-bg, #f4f4f5);
      --_border-color: var(--ds-alert-warning-border-color, var(--ds-alert-border-color, #d4d4d8));
    }

    :host([variant="danger"]) {
      --_accent: var(--ds-alert-danger-accent, #27272a);
      --_bg: var(--ds-alert-danger-bg, #ededf0);
      --_border-color: var(--ds-alert-danger-border-color, var(--ds-alert-border-color, #c7c7cc));
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
