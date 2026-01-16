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
      color: var(--ds-color-text, #111827);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-checkbox-gap, var(--ds-space-xs, 6px));
      cursor: pointer;
      min-height: 44px;
    }

    input {
      appearance: none;
      width: var(--ds-checkbox-size, 18px);
      height: var(--ds-checkbox-size, 18px);
      border-radius: var(--ds-checkbox-radius, 4px);
      border: var(--ds-checkbox-border, 1px solid var(--ds-color-border, #e5e7eb));
      background: var(--ds-checkbox-bg, #ffffff);
      display: inline-grid;
      place-items: center;
      transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    }

    input::after {
      content: '';
      width: calc(var(--ds-checkbox-size, 18px) * 0.45);
      height: calc(var(--ds-checkbox-size, 18px) * 0.25);
      border: 2px solid var(--ds-checkbox-check-color, #ffffff);
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg);
      opacity: 0;
    }

    input:checked {
      border: var(--ds-checkbox-border-checked, 1px solid var(--ds-color-primary, #2563eb));
      background: var(--ds-checkbox-bg-checked, var(--ds-color-primary, #2563eb));
    }

    input:checked::after {
      opacity: 1;
    }

    input:focus-visible {
      outline: none;
      box-shadow: var(--ds-checkbox-focus-shadow, 0 0 0 3px var(--ds-checkbox-focus-ring, var(--ds-color-focus)));
    }

    :host([disabled]) label {
      cursor: not-allowed;
      opacity: var(--ds-checkbox-disabled-opacity, 0.6);
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
        <span part="text"><slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-checkbox': DsCheckbox;
  }
}
