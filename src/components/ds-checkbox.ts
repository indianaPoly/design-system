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
      font-family: var(--ds-font-family, "Inter", system-ui, sans-serif);
      color: var(--ds-color-text, #111827);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-xs, 6px);
      cursor: pointer;
    }

    input {
      width: 18px;
      height: 18px;
      accent-color: var(--ds-color-primary, #2563eb);
    }

    :host([disabled]) label {
      cursor: not-allowed;
      opacity: 0.6;
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
