import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@customElement('ds-button')
export class DsButton extends LitElement {
  @property({ type: String, reflect: true })
  declare variant: ButtonVariant;

  @property({ type: String, reflect: true })
  declare size: ButtonSize;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.disabled = false;
  }

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--ds-font-family, "Inter", system-ui, sans-serif);
    }

    button {
      border: none;
      border-radius: var(--ds-radius-md, 8px);
      padding: var(--ds-space-sm, 8px) var(--ds-space-md, 12px);
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
      background: var(--ds-color-primary, #2563eb);
      color: var(--ds-color-on-primary, #ffffff);
    }

    button:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px var(--ds-color-focus, rgba(37, 99, 235, 0.35));
    }

    :host([variant="secondary"]) button {
      background: var(--ds-color-secondary, #111827);
      color: var(--ds-color-on-secondary, #ffffff);
    }

    :host([variant="ghost"]) button {
      background: transparent;
      color: var(--ds-color-primary, #2563eb);
      border: 1px solid var(--ds-color-border, #d1d5db);
    }

    :host([size="sm"]) button {
      font-size: 0.875rem;
      padding: var(--ds-space-xs, 6px) var(--ds-space-sm, 8px);
    }

    :host([size="lg"]) button {
      font-size: 1.125rem;
      padding: var(--ds-space-md, 12px) var(--ds-space-lg, 16px);
    }

    :host([disabled]) button {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  render() {
    return html`<button part="button" ?disabled=${this.disabled}>
      <slot></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
  }
}
