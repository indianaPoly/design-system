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
      font-family: var(--ds-button-font-family, var(--ds-font-family, "Inter", system-ui, sans-serif));
    }

    button {
      appearance: none;
      border-radius: var(--ds-button-radius, var(--ds-radius-md, 8px));
      padding: var(--ds-button-md-padding-y, var(--ds-space-sm, 8px))
        var(--ds-button-md-padding-x, var(--ds-space-md, 12px));
      min-height: var(--ds-button-md-min-height, auto);
      line-height: 1.2;
      font-size: var(--ds-button-md-font-size, 1rem);
      font-weight: var(--ds-button-font-weight, 600);
      letter-spacing: var(--ds-button-letter-spacing, normal);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;

      background: var(--ds-button-primary-bg, var(--ds-color-primary, #2563eb));
      color: var(--ds-button-primary-fg, var(--ds-color-on-primary, #ffffff));
      border: 1px solid var(--ds-button-primary-border, transparent);
      box-shadow: var(--ds-button-shadow, none);
      -webkit-tap-highlight-color: transparent;
    }

    button:hover:not(:disabled) {
      background: var(--ds-button-primary-bg-hover, var(--ds-button-primary-bg, var(--ds-color-primary, #2563eb)));
    }

    button:active:not(:disabled) {
      background: var(
        --ds-button-primary-bg-active,
        var(--ds-button-primary-bg, var(--ds-color-primary, #2563eb))
      );
    }

    button:focus-visible {
      outline: none;
      box-shadow: var(
        --ds-button-focus-shadow,
        0 0 0 3px var(--ds-button-focus-ring, var(--ds-color-focus, rgba(37, 99, 235, 0.35)))
      );
    }

    :host([variant="secondary"]) button {
      background: var(--ds-button-secondary-bg, var(--ds-color-secondary, #111827));
      color: var(--ds-button-secondary-fg, var(--ds-color-on-secondary, #ffffff));
      border: 1px solid var(--ds-button-secondary-border, transparent);
    }

    :host([variant="secondary"]) button:hover:not(:disabled) {
      background: var(--ds-button-secondary-bg-hover, var(--ds-button-secondary-bg, var(--ds-color-secondary, #111827)));
    }

    :host([variant="secondary"]) button:active:not(:disabled) {
      background: var(
        --ds-button-secondary-bg-active,
        var(--ds-button-secondary-bg, var(--ds-color-secondary, #111827))
      );
    }

    :host([variant="ghost"]) button {
      background: var(--ds-button-ghost-bg, transparent);
      color: var(--ds-button-ghost-fg, var(--ds-color-primary, #2563eb));
      border: 1px solid var(--ds-button-ghost-border, var(--ds-color-border, #d1d5db));
      box-shadow: none;
    }

    :host([variant="ghost"]) button:hover:not(:disabled) {
      background: var(--ds-button-ghost-bg-hover, var(--ds-button-ghost-bg, transparent));
    }

    :host([variant="ghost"]) button:active:not(:disabled) {
      background: var(--ds-button-ghost-bg-active, var(--ds-button-ghost-bg, transparent));
    }

    :host([size="sm"]) button {
      font-size: var(--ds-button-sm-font-size, 0.875rem);
      padding: var(--ds-button-sm-padding-y, var(--ds-space-xs, 6px))
        var(--ds-button-sm-padding-x, var(--ds-space-sm, 8px));
      min-height: var(--ds-button-sm-min-height, auto);
    }

    :host([size="lg"]) button {
      font-size: var(--ds-button-lg-font-size, 1.125rem);
      padding: var(--ds-button-lg-padding-y, var(--ds-space-md, 12px))
        var(--ds-button-lg-padding-x, var(--ds-space-lg, 16px));
      min-height: var(--ds-button-lg-min-height, auto);
    }

    :host([disabled]) button {
      opacity: var(--ds-button-disabled-opacity, 0.6);
      cursor: not-allowed;
      box-shadow: none;
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
