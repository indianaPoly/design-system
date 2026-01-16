import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('ds-textarea')
export class DsTextarea extends LitElement {
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

  @property({ type: Number })
  declare rows: number;

  @property({ type: Number })
  declare maxLength: number | undefined;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property({ type: Boolean, reflect: true })
  declare required: boolean;

  @property({ type: Boolean, reflect: true })
  declare readonly: boolean;

  private textareaId = `ds-textarea-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  constructor() {
    super();
    this.label = '';
    this.helper = '';
    this.error = '';
    this.value = '';
    this.placeholder = '';
    this.name = '';
    this.rows = 4;
    this.maxLength = undefined;
    this.disabled = false;
    this.required = false;
    this.readonly = false;
  }

  private get helperId() {
    return `${this.textareaId}-helper`;
  }

  private get errorId() {
    return `${this.textareaId}-error`;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(
        --ds-textarea-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
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

    textarea {
      appearance: none;
      border: var(--ds-textarea-border, 1px solid var(--ds-color-input-border, #d1d5db));
      border-radius: var(--ds-textarea-radius, var(--ds-radius-md, 8px));
      padding: var(--ds-textarea-padding-y, var(--ds-space-sm, 8px))
        var(--ds-textarea-padding-x, var(--ds-space-md, 12px));
      font-size: var(--ds-textarea-font-size, 1rem);
      background: var(--ds-textarea-bg, var(--ds-color-input-bg, #ffffff));
      color: var(--ds-textarea-text-color, var(--ds-color-text, #111827));
      box-shadow: var(--ds-textarea-shadow, none);
      transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      resize: vertical;
    }

    textarea::placeholder {
      color: var(--ds-textarea-placeholder-color, var(--ds-color-input-placeholder, #9ca3af));
    }

    textarea:focus-visible {
      outline: none;
      border: var(--ds-textarea-border-focus, 1px solid var(--ds-color-primary, #2563eb));
      box-shadow: var(--ds-textarea-focus-shadow, 0 0 0 3px var(--ds-textarea-focus-ring, var(--ds-color-focus)));
    }

    :host([disabled]) textarea {
      opacity: var(--ds-textarea-disabled-opacity, 0.6);
      cursor: not-allowed;
      background: var(--ds-textarea-disabled-bg, var(--ds-color-surface-muted, #f9fafb));
      box-shadow: none;
    }

    :host([readonly]) textarea {
      background: var(--ds-textarea-readonly-bg, var(--ds-color-surface-muted, #f9fafb));
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
    const target = event.target as HTMLTextAreaElement;
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
        <textarea
          id=${this.textareaId}
          part="textarea"
          .value=${this.value}
          placeholder=${this.placeholder}
          name=${this.name}
          rows=${this.rows}
          maxlength=${ifDefined(this.maxLength)}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${ifDefined(describedBy)}
          @input=${this.handleInput}
          @change=${this.handleChange}
        ></textarea>
        ${messageTemplate}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-textarea': DsTextarea;
  }
}
