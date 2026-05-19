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
    }

    .card {
      display: grid;
      gap: var(--ds-card-gap, 16px);
      padding: var(--ds-card-padding, 24px);
      border-radius: var(--ds-card-radius, var(--ds-radius-xl, 24px));
      border: var(--ds-card-border, 1px solid var(--ds-color-border, #e4e4e7));
      background: var(--ds-card-bg, var(--ds-color-surface, #ffffff));
      box-shadow: var(--ds-card-shadow, 0 8px 24px rgba(17, 17, 17, 0.06));
    }

    :host([elevation="2"]) .card {
      box-shadow: var(--ds-card-shadow-elevation-2, 0 18px 40px rgba(17, 17, 17, 0.08));
    }

    :host([elevation="0"]) .card {
      box-shadow: var(--ds-card-shadow-elevation-0, none);
    }

    .header,
    .footer {
      display: block;
    }

    .header {
      color: var(--ds-color-text, #111111);
      font-size: 1.0625rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .body {
      color: var(--ds-color-text, #111111);
      line-height: 1.6;
    }

    .footer {
      color: var(--ds-color-muted, #6b7280);
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
