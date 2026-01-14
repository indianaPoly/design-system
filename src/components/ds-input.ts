import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';

@customElement('ds-input')
export class DsInput extends LitElement {
  @property({ type: String })
  label = '';

  @property({ type: String })
  helper = '';

  @property({ type: String })
  error = '';

  @property({ type: String })
  value = '';

  @property({ type: String })
  placeholder = '';

  @property({ type: String })
  name = '';

  @property({ type: String })
  autocomplete = '';

  @property({ type: String })
  min = '';

  @property({ type: String })
  max = '';

  @property({ type: String })
  step = '';

  @property({ type: String })
  type: InputType = 'text';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  private inputId = `ds-input-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  private get helperId() {
    return `${this.inputId}-helper`;
  }

  private get errorId() {
    return `${this.inputId}-error`;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--ds-font-family, "Inter", system-ui, sans-serif);
      color: var(--ds-color-text, #111827);
    }

    .field {
      display: grid;
      gap: var(--ds-space-xs, 6px);
    }

    .label {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .required {
      color: var(--ds-color-danger, #dc2626);
      margin-left: 4px;
    }

    input {
      border: 1px solid var(--ds-color-input-border, #d1d5db);
      border-radius: var(--ds-radius-md, 8px);
      padding: var(--ds-space-sm, 8px) var(--ds-space-md, 12px);
      font-size: 1rem;
      background: var(--ds-color-input-bg, #ffffff);
      color: var(--ds-color-text, #111827);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    input::placeholder {
      color: var(--ds-color-input-placeholder, #9ca3af);
    }

    input:focus-visible {
      outline: none;
      border-color: var(--ds-color-primary, #2563eb);
      box-shadow: 0 0 0 3px var(--ds-color-focus, rgba(37, 99, 235, 0.35));
    }

    :host([disabled]) input {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--ds-color-surface-muted, #f9fafb);
    }

    :host([readonly]) input {
      background: var(--ds-color-surface-muted, #f9fafb);
    }

    .message {
      font-size: 0.8125rem;
      color: var(--ds-color-muted, #6b7280);
    }

    .message.error {
      color: var(--ds-color-danger, #dc2626);
      font-weight: 600;
    }
  `;

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  private handleChange() {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  render() {
    const describedBy = this.error ? this.errorId : this.helper ? this.helperId : undefined;
    const hasMessage = Boolean(this.error || this.helper);

    return html`
      <label class="field" part="field">
        ${this.label
          ? html`<span class="label" part="label">
              ${this.label}${this.required ? html`<span class="required">*</span>` : ''}
            </span>`
          : null}
        <input
          id=${this.inputId}
          part="input"
          .value=${this.value}
          type=${this.type}
          placeholder=${this.placeholder}
          name=${this.name}
          autocomplete=${this.autocomplete}
          min=${ifDefined(this.min || undefined)}
          max=${ifDefined(this.max || undefined)}
          step=${ifDefined(this.step || undefined)}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${ifDefined(describedBy)}
          @input=${this.handleInput}
          @change=${this.handleChange}
        />
        ${hasMessage
          ? html`<span
              id=${this.error ? this.errorId : this.helperId}
              class="message ${this.error ? 'error' : 'helper'}"
              part="message"
            >
              ${this.error || this.helper}
            </span>`
          : null}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-input': DsInput;
  }
}
