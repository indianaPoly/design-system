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
      font-family: var(
        --ds-input-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
      color: var(--ds-color-text, #111111);
    }

    .field {
      display: grid;
      gap: 10px;
    }

    .label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9375rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .required {
      color: var(--ds-color-danger, #27272a);
    }

    .control {
      display: flex;
      align-items: center;
      min-height: var(--ds-input-min-height, 52px);
      border: var(--ds-input-border, 1px solid var(--ds-color-input-border, #e4e4e7));
      border-radius: var(--ds-input-radius, var(--ds-radius-md, 16px));
      background: var(--ds-input-bg, #ffffff);
      box-shadow: var(--ds-input-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.72));
      transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
    }

    .field:focus-within .control {
      border: var(--ds-input-border-focus, 1px solid var(--ds-color-primary, #111111));
      box-shadow: var(--ds-input-focus-shadow, 0 0 0 4px rgba(17, 17, 17, 0.1));
    }

    .field.field-error .control {
      border: var(--ds-input-border-error, 1px solid var(--ds-color-danger, #27272a));
      box-shadow: var(--ds-input-error-shadow, 0 0 0 4px rgba(39, 39, 42, 0.08));
    }

    input {
      appearance: none;
      width: 100%;
      min-width: 0;
      border: 0;
      padding: var(--ds-input-padding-y, 14px) var(--ds-input-padding-x, 16px);
      background: transparent;
      color: var(--ds-input-text-color, var(--ds-color-text, #111111));
      font: inherit;
      line-height: 1.4;
    }

    input:focus {
      outline: none;
    }

    input::placeholder {
      color: var(--ds-input-placeholder-color, var(--ds-color-input-placeholder, #9ca3af));
    }

    :host([disabled]) .control {
      background: var(--ds-input-disabled-bg, #f3f4f6);
      box-shadow: none;
    }

    :host([disabled]) input {
      opacity: var(--ds-input-disabled-opacity, 0.56);
      cursor: not-allowed;
    }

    :host([readonly]) .control {
      background: var(--ds-input-readonly-bg, #fafafa);
    }

    .message {
      font-size: 0.8125rem;
      color: var(--ds-color-muted, #6b7280);
      line-height: 1.4;
    }

    .message.error {
      color: var(--ds-color-text, #111111);
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

    const fieldClass = this.error ? 'field field-error' : 'field';

    return html`
      <label class=${fieldClass} part="field">
        ${labelTemplate}
        <div class="control" part="control">
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
        </div>
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
