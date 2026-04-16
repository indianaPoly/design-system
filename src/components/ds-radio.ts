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
      color: var(--ds-color-text, #111111);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-radio-gap, 12px);
      min-height: 44px;
      cursor: pointer;
      font-size: 0.9375rem;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    input {
      appearance: none;
      margin: 0;
      width: var(--ds-radio-size, 20px);
      height: var(--ds-radio-size, 20px);
      border-radius: 999px;
      border: var(--ds-radio-border, 1.5px solid var(--ds-color-border-strong, #d4d4d8));
      background: var(--ds-radio-bg, #ffffff);
      box-shadow: var(--ds-shadow-inset, inset 0 1px 0 rgba(255, 255, 255, 0.72));
      display: inline-grid;
      place-items: center;
      transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
      flex-shrink: 0;
    }

    input::after {
      content: '';
      width: calc(var(--ds-radio-size, 20px) * 0.38);
      height: calc(var(--ds-radio-size, 20px) * 0.38);
      border-radius: 999px;
      background: var(--ds-radio-dot-color, var(--ds-color-on-primary, #ffffff));
      transform: scale(0);
      transition: transform 0.18s ease;
    }

    label:hover input:not(:disabled) {
      border-color: var(--ds-color-text, #111111);
    }

    input:checked {
      border: var(--ds-radio-border-checked, 1.5px solid var(--ds-color-primary, #111111));
      background: var(--ds-radio-bg-checked, var(--ds-color-primary, #111111));
      box-shadow: none;
    }

    input:checked::after {
      transform: scale(1);
    }

    input:focus-visible {
      outline: none;
      box-shadow: var(--ds-radio-focus-shadow, 0 0 0 4px var(--ds-radio-focus-ring, rgba(17, 17, 17, 0.1)));
    }

    .text {
      line-height: 1.45;
    }

    :host([disabled]) label {
      cursor: not-allowed;
      opacity: var(--ds-radio-disabled-opacity, 0.56);
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
        <span class="text" part="text"><slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-radio': DsRadio;
  }
}
