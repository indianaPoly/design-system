import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';

@customElement('ds-input')
export class DsInput extends LitElement {
  @property({ type: String })
  declare label: string;

  @property({ type: String })
  declare helper: string;

  @property({ type: String })
  declare error: string;

  @property({ type: String })
  declare value: string;

  @property({ type: String })
  declare placeholder: string;

  @property({ type: String })
  declare name: string;

  @property({ type: String })
  declare autocomplete: string;

  @property({ type: String })
  declare min: string;

  @property({ type: String })
  declare max: string;

  @property({ type: String })
  declare step: string;

  @property({ type: String })
  declare type: InputType;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property({ type: Boolean, reflect: true })
  declare required: boolean;

  @property({ type: Boolean, reflect: true })
  declare readonly: boolean;

  private inputId = `ds-input-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  constructor() {
    super();
    this.label = '';
    this.helper = '';
    this.error = '';
    this.value = '';
    this.placeholder = '';
    this.name = '';
    this.autocomplete = '';
    this.min = '';
    this.max = '';
    this.step = '';
    this.type = 'text';
    this.disabled = false;
    this.required = false;
    this.readonly = false;
  }

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
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  private handleChange(event: Event) {
    event.stopPropagation();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  render() {
    let describedBy: string | undefined;
    if (this.error) {
      describedBy = this.errorId;
    } else if (this.helper) {
      describedBy = this.helperId;
    }

    const requiredTemplate = this.required ? html`<span class="required">*</span>` : null;
    const labelTemplate = this.label
      ? html`<span class="label" part="label">${this.label}${requiredTemplate}</span>`
      : null;

    const messageText = this.error || this.helper;
    const messageId = this.error ? this.errorId : this.helperId;
    const messageVariant = this.error ? 'error' : 'helper';
    const messageTemplate = messageText
      ? html`<span id=${messageId} class="message ${messageVariant}" part="message">${messageText}</span>`
      : null;

    return html`
      <label class="field" part="field">
        ${labelTemplate}
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
        ${messageTemplate}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-input': DsInput;
  }
}
