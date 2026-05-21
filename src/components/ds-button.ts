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

      /* Local variable bridging for easier customization */
      --_bg: var(--ds-button-bg, var(--ds-button-primary-bg, var(--ds-color-primary, #111111)));
      --_bg-hover: var(--ds-button-bg-hover, var(--ds-button-primary-bg-hover, var(--_bg)));
      --_bg-active: var(--ds-button-bg-active, var(--ds-button-primary-bg-active, var(--_bg)));
      --_color: var(--ds-button-color, var(--ds-button-primary-fg, var(--ds-color-on-primary, #ffffff)));
      --_border-color: var(--ds-button-primary-border, transparent);
      --_border: var(--ds-button-border, 1px solid var(--_border-color));
      --_radius: var(--ds-button-radius, var(--ds-radius-md, 16px));
      --_shadow: var(--ds-button-shadow, 0 10px 24px rgba(17, 17, 17, 0.1));
      --_font-size: var(--ds-button-font-size, var(--ds-button-md-font-size, 0.9375rem));
      --_min-height: var(--ds-button-min-height, var(--ds-button-md-min-height, 48px));
      --_padding: var(--ds-button-padding, var(--ds-button-md-padding-y, 13px) var(--ds-button-md-padding-x, 18px));
      --_transition: var(
        --ds-button-transition,
        background 0.18s ease,
        border-color 0.18s ease,
        color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.18s ease
      );
    }

    button {
      appearance: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--ds-space-2xs, 4px);
      min-height: var(--_min-height);
      padding: var(--_padding);
      border-radius: var(--_radius);
      border: var(--_border);
      background: var(--_bg);
      color: var(--_color);
      box-shadow: var(--_shadow);
      line-height: 1;
      font-size: var(--_font-size);
      font-weight: var(--ds-button-font-weight, 600);
      letter-spacing: var(--ds-button-letter-spacing, -0.01em);
      cursor: pointer;
      box-sizing: border-box;
      user-select: none;
      transition: var(--_transition);
      -webkit-tap-highlight-color: transparent;
    }

    button:hover:not(:disabled) {
      background: var(--_bg-hover);
      transform: translateY(-1px);
      box-shadow: var(--ds-shadow-md, var(--_shadow));
    }

    button:active:not(:disabled) {
      background: var(--_bg-active);
      transform: translateY(1px);
      box-shadow: var(--ds-shadow-xs, 0 1px 2px rgba(17, 17, 17, 0.04));
    }

    button:focus-visible {
      outline: none;
      box-shadow: var(--ds-button-focus-shadow, 0 0 0 4px var(--ds-button-focus-ring, rgba(17, 17, 17, 0.1)));
    }

    :host([variant="secondary"]) {
      --_bg: var(--ds-button-secondary-bg, var(--ds-color-secondary, #f4f4f5));
      --_bg-hover: var(--ds-button-secondary-bg-hover, var(--_bg));
      --_bg-active: var(--ds-button-secondary-bg-active, var(--_bg));
      --_color: var(--ds-button-secondary-fg, var(--ds-color-on-secondary, #18181b));
      --_border-color: var(--ds-button-secondary-border, var(--ds-color-border, #e4e4e7));
      --_shadow: none;
    }

    :host([variant="secondary"]) button:hover:not(:disabled) {
      box-shadow: var(--ds-shadow-xs, 0 1px 2px rgba(17, 17, 17, 0.04));
    }

    :host([variant="ghost"]) {
      --_bg: var(--ds-button-ghost-bg, transparent);
      --_bg-hover: var(--ds-button-ghost-bg-hover, #f4f4f5);
      --_bg-active: var(--ds-button-ghost-bg-active, #eaeaec);
      --_color: var(--ds-button-ghost-fg, #52525b);
      --_border-color: var(--ds-button-ghost-border, transparent);
      --_shadow: none;
    }

    :host([variant="ghost"]) button:hover:not(:disabled) {
      box-shadow: none;
    }

    :host([size="sm"]) {
      --_min-height: var(--ds-button-sm-min-height, 40px);
      --_padding: var(--ds-button-sm-padding-y, 10px) var(--ds-button-sm-padding-x, 14px);
      --_font-size: var(--ds-button-sm-font-size, 0.875rem);
    }

    :host([size="lg"]) {
      --_min-height: var(--ds-button-lg-min-height, 56px);
      --_padding: var(--ds-button-lg-padding-y, 16px) var(--ds-button-lg-padding-x, 22px);
      --_font-size: var(--ds-button-lg-font-size, 1rem);
    }

    :host([disabled]) {
      --_shadow: none;
    }

    :host([disabled]) button {
      opacity: var(--ds-button-disabled-opacity, 0.48);
      cursor: not-allowed;
      transform: none;
    }
  `;

  render() {
    return html`
      <button part="button" type=${this.type} ?disabled=${this.disabled}>
        <slot name="prefix" part="prefix"></slot>
        <slot part="label"></slot>
        <slot name="suffix" part="suffix"></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
  }
}
