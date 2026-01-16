import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('ds-radio')
export class DsRadio extends LitElement {
  @property({ type: Boolean, reflect: true })
  declare checked: boolean;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property({ type: String })
  declare name: string;

  @property({ type: String })
  declare value: string;

  private inputId = `ds-radio-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
    this.name = '';
    this.value = '';
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(
        --ds-radio-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
      color: var(--ds-color-text, #111827);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-radio-gap, var(--ds-space-xs, 6px));
      cursor: pointer;
      min-height: 44px;
    }

    input {
      appearance: none;
      width: var(--ds-radio-size, 18px);
      height: var(--ds-radio-size, 18px);
      border-radius: 999px;
      border: var(--ds-radio-border, 1px solid var(--ds-color-border, #e5e7eb));
      background: var(--ds-radio-bg, #ffffff);
      display: inline-grid;
      place-items: center;
      transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    }

    input::after {
      content: '';
      width: calc(var(--ds-radio-size, 18px) * 0.45);
      height: calc(var(--ds-radio-size, 18px) * 0.45);
      border-radius: 999px;
      background: var(--ds-radio-dot-color, var(--ds-color-primary, #2563eb));
      transform: scale(0);
      transition: transform 0.15s ease;
    }

    input:checked {
      border: var(--ds-radio-border-checked, 1px solid var(--ds-color-primary, #2563eb));
    }

    input:checked::after {
      transform: scale(1);
    }

    input:focus-visible {
      outline: none;
      box-shadow: var(--ds-radio-focus-shadow, 0 0 0 3px var(--ds-radio-focus-ring, var(--ds-color-focus)));
    }

    :host([disabled]) label {
      cursor: not-allowed;
      opacity: var(--ds-radio-disabled-opacity, 0.6);
    }

    :host([disabled]) input {
      box-shadow: none;
    }
  `;

  private handleChange(event: Event) {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <label part="label" for=${this.inputId}>
        <input
          id=${this.inputId}
          part="radio"
          type="radio"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          name=${ifDefined(this.name || undefined)}
          value=${this.value}
          @change=${this.handleChange}
        />
        <span part="text"><slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-radio': DsRadio;
  }
}
