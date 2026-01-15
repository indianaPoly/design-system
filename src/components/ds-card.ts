import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ds-card')
export class DsCard extends LitElement {
  @property({ type: Number, reflect: true })
  declare elevation: number;

  constructor() {
    super();
    this.elevation = 1;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--ds-font-family, "Inter", system-ui, sans-serif);
    }

    .card {
      border-radius: var(--ds-radius-lg, 12px);
      border: 1px solid var(--ds-color-border, #e5e7eb);
      padding: var(--ds-space-lg, 16px);
      background: var(--ds-color-surface, #ffffff);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
      display: grid;
      gap: var(--ds-space-md, 12px);
    }

    :host([elevation="2"]) .card {
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
    }

    :host([elevation="0"]) .card {
      box-shadow: none;
    }

    .header,
    .footer {
      display: block;
    }
  `;

  render() {
    return html`
      <article class="card" part="card">
        <header class="header" part="header">
          <slot name="header"></slot>
        </header>
        <section class="body" part="body">
          <slot></slot>
        </section>
        <footer class="footer" part="footer">
          <slot name="footer"></slot>
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
