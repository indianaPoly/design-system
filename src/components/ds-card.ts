import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('ds-card')
export class DsCard extends LitElement {
  @property({ type: Number, reflect: true })
  declare elevation: number;

  @state()
  declare private hasHeader: boolean;

  @state()
  declare private hasFooter: boolean;

  constructor() {
    super();
    this.elevation = 1;
    this.hasHeader = false;
    this.hasFooter = false;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(
        --ds-card-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );

      /* Local variable bridging */
      --_gap: var(--ds-card-gap, 16px);
      --_padding: var(--ds-card-padding, 24px);
      --_radius: var(--ds-card-radius, var(--ds-radius-xl, 24px));
      --_border: var(--ds-card-border, 1px solid var(--ds-color-border, #e4e4e7));
      --_bg: var(--ds-card-bg, var(--ds-color-surface, #ffffff));
      --_shadow: var(--ds-card-shadow, 0 8px 24px rgba(17, 17, 17, 0.06));
      --_color: var(--ds-card-color, var(--ds-color-text, #111111));
    }

    .card {
      display: grid;
      gap: var(--_gap);
      padding: var(--_padding);
      border-radius: var(--_radius);
      border: var(--_border);
      background: var(--_bg);
      box-shadow: var(--_shadow);
      color: var(--_color);
      box-sizing: border-box;
    }

    :host([elevation="2"]) {
      --_shadow: var(--ds-card-shadow-elevation-2, 0 18px 40px rgba(17, 17, 17, 0.08));
    }

    :host([elevation="0"]) {
      --_shadow: var(--ds-card-shadow-elevation-0, none);
    }

    .header,
    .footer {
      display: block;
    }

    .header {
      color: var(--ds-card-header-color, var(--_color));
      font-size: 1.0625rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.3;
    }

    .body {
      color: var(--ds-card-body-color, var(--_color));
      line-height: 1.6;
    }

    .footer {
      color: var(--ds-card-footer-color, var(--ds-color-muted, #6b7280));
      padding-top: 2px;
    }

    .header[hidden],
    .footer[hidden] {
      display: none;
    }

    slot[name='header']::slotted(*) {
      margin: 0;
    }

    slot[name='footer']::slotted(*) {
      margin: 0;
    }
  `;

  private handleSlotChange(slotName: 'header' | 'footer', event: Event) {
    const slot = event.target as HTMLSlotElement;
    const hasContent = slot.assignedNodes({ flatten: true }).length > 0;

    if (slotName === 'header') {
      this.hasHeader = hasContent;
      return;
    }

    this.hasFooter = hasContent;
  }

  render() {
    return html`
      <article class="card" part="card">
        <header class="header" part="header" ?hidden=${!this.hasHeader}>
          <slot name="header" @slotchange=${(event: Event) => this.handleSlotChange('header', event)}></slot>
        </header>
        <section class="body" part="body">
          <slot></slot>
        </section>
        <footer class="footer" part="footer" ?hidden=${!this.hasFooter}>
          <slot name="footer" @slotchange=${(event: Event) => this.handleSlotChange('footer', event)}></slot>
        </footer>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-card': DsCard;
  }
}
