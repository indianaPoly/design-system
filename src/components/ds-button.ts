import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@customElement('ds-button')
export class DsButton extends LitElement {
  @property({ type: String, reflect: true })
  declare variant: ButtonVariant;

  @property({ type: String, reflect: true })
  declare size: ButtonSize;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property({ type: String, reflect: true })
  declare type: ButtonType;

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.disabled = false;
    this.type = 'submit';
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(--ds-button-font-family, var(--ds-font-family, "Inter", system-ui, sans-serif));
    }

    button {
      appearance: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--ds-space-2xs, 4px);
      min-height: var(--ds-button-md-min-height, 48px);
      padding: var(--ds-button-md-padding-y, 13px) var(--ds-button-md-padding-x, 18px);
      border-radius: var(--ds-button-radius, var(--ds-radius-md, 16px));
      border: 1px solid var(--ds-button-primary-border, transparent);
      background: var(--ds-button-primary-bg, var(--ds-color-primary, #111111));
      color: var(--ds-button-primary-fg, var(--ds-color-on-primary, #ffffff));
      box-shadow: var(--ds-button-shadow, 0 10px 24px rgba(17, 17, 17, 0.1));
      line-height: 1;
      font-size: var(--ds-button-md-font-size, 0.9375rem);
      font-weight: var(--ds-button-font-weight, 600);
      letter-spacing: var(--ds-button-letter-spacing, -0.01em);
      cursor: pointer;
      box-sizing: border-box;
      user-select: none;
      transition: var(
        --ds-button-transition,
        background 0.18s ease,
        border-color 0.18s ease,
        color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.18s ease
      );
      -webkit-tap-highlight-color: transparent;
    }

    button:hover:not(:disabled) {
      background: var(--ds-button-primary-bg-hover, var(--ds-button-primary-bg, var(--ds-color-primary, #111111)));
      transform: translateY(-1px);
      box-shadow: var(--ds-shadow-md, var(--ds-button-shadow, 0 10px 24px rgba(17, 17, 17, 0.1)));
    }

    button:active:not(:disabled) {
      background: var(
        --ds-button-primary-bg-active,
        var(--ds-button-primary-bg, var(--ds-color-primary, #111111))
      );
      transform: translateY(1px);
      box-shadow: var(--ds-shadow-xs, 0 1px 2px rgba(17, 17, 17, 0.04));
    }

    button:focus-visible {
      outline: none;
      box-shadow: var(--ds-button-focus-shadow, 0 0 0 4px var(--ds-button-focus-ring, rgba(17, 17, 17, 0.1)));
    }

    :host([variant="secondary"]) button {
      background: var(--ds-button-secondary-bg, var(--ds-color-secondary, #f4f4f5));
      color: var(--ds-button-secondary-fg, var(--ds-color-on-secondary, #18181b));
      border-color: var(--ds-button-secondary-border, var(--ds-color-border, #e4e4e7));
      box-shadow: none;
    }

    :host([variant="secondary"]) button:hover:not(:disabled) {
      background: var(--ds-button-secondary-bg-hover, var(--ds-button-secondary-bg, var(--ds-color-secondary, #f4f4f5)));
      box-shadow: var(--ds-shadow-xs, 0 1px 2px rgba(17, 17, 17, 0.04));
    }

    :host([variant="secondary"]) button:active:not(:disabled) {
      background: var(
        --ds-button-secondary-bg-active,
        var(--ds-button-secondary-bg, var(--ds-color-secondary, #f4f4f5))
      );
    }

    :host([variant="ghost"]) button {
      background: var(--ds-button-ghost-bg, transparent);
      color: var(--ds-button-ghost-fg, #52525b);
      border-color: var(--ds-button-ghost-border, transparent);
      box-shadow: none;
    }

    :host([variant="ghost"]) button:hover:not(:disabled) {
      background: var(--ds-button-ghost-bg-hover, #f4f4f5);
      box-shadow: none;
    }

    :host([variant="ghost"]) button:active:not(:disabled) {
      background: var(--ds-button-ghost-bg-active, #eaeaec);
    }

    :host([size="sm"]) button {
      min-height: var(--ds-button-sm-min-height, 40px);
      padding: var(--ds-button-sm-padding-y, 10px) var(--ds-button-sm-padding-x, 14px);
      font-size: var(--ds-button-sm-font-size, 0.875rem);
    }

    :host([size="lg"]) button {
      min-height: var(--ds-button-lg-min-height, 56px);
      padding: var(--ds-button-lg-padding-y, 16px) var(--ds-button-lg-padding-x, 22px);
      font-size: var(--ds-button-lg-font-size, 1rem);
    }

    :host([disabled]) button {
      opacity: var(--ds-button-disabled-opacity, 0.48);
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
  `;

  render() {
    return html`<button part="button" type=${this.type} ?disabled=${this.disabled}>
      <slot></slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
  }
}
