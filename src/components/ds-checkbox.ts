import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('ds-checkbox')
export class DsCheckbox extends LitElement {
  @property({ type: Boolean, reflect: true })
  declare checked: boolean;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property({ type: String })
  declare name: string;

  @property({ type: String })
  declare value: string;

  private inputId = `ds-checkbox-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
    this.name = '';
    this.value = 'on';
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(
        --ds-checkbox-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
      color: var(--ds-color-text, #111111);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-checkbox-gap, 12px);
      min-height: 44px;
      cursor: pointer;
      font-size: 0.9375rem;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    input {
      appearance: none;
      margin: 0;
      width: var(--ds-checkbox-size, 20px);
      height: var(--ds-checkbox-size, 20px);
      border-radius: var(--ds-checkbox-radius, 6px);
      border: var(--ds-checkbox-border, 1.5px solid var(--ds-color-border-strong, #d4d4d8));
      background: var(--ds-checkbox-bg, #ffffff);
      box-shadow: var(--ds-shadow-inset, inset 0 1px 0 rgba(255, 255, 255, 0.72));
      display: inline-grid;
      place-items: center;
      transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
      flex-shrink: 0;
    }

    input::after {
      content: '';
      width: calc(var(--ds-checkbox-size, 20px) * 0.42);
      height: calc(var(--ds-checkbox-size, 20px) * 0.22);
      border: 2px solid var(--ds-checkbox-check-color, var(--ds-color-on-primary, #ffffff));
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg) translateY(-1px);
      opacity: 0;
    }

    label:hover input:not(:disabled) {
      border-color: var(--ds-color-text, #111111);
    }

    input:checked {
      border: var(--ds-checkbox-border-checked, 1.5px solid var(--ds-color-primary, #111111));
      background: var(--ds-checkbox-bg-checked, var(--ds-color-primary, #111111));
      box-shadow: none;
    }

    input:checked::after {
      opacity: 1;
    }

    input:focus-visible {
      outline: none;
      box-shadow: var(--ds-checkbox-focus-shadow, 0 0 0 4px var(--ds-checkbox-focus-ring, rgba(17, 17, 17, 0.1)));
    }

    .text {
      line-height: 1.45;
    }

    :host([disabled]) label {
      cursor: not-allowed;
      opacity: var(--ds-checkbox-disabled-opacity, 0.56);
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
          part="checkbox"
          type="checkbox"
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
    'ds-checkbox': DsCheckbox;
  }
}
