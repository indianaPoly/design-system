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
      border: var(--ds-textarea-border, 1px solid var(--ds-color-input-border, #e4e4e7));
      border-radius: var(--ds-textarea-radius, var(--ds-radius-md, 16px));
      background: var(--ds-textarea-bg, #ffffff);
      box-shadow: var(--ds-textarea-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.72));
      transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
    }

    .field:focus-within .control {
      border: var(--ds-textarea-border-focus, 1px solid var(--ds-color-primary, #111111));
      box-shadow: var(--ds-textarea-focus-shadow, 0 0 0 4px rgba(17, 17, 17, 0.1));
    }

    .field.field-error .control {
      border: var(--ds-textarea-border-error, 1px solid var(--ds-color-danger, #27272a));
      box-shadow: var(--ds-textarea-error-shadow, 0 0 0 4px rgba(39, 39, 42, 0.08));
    }

    textarea {
      width: 100%;
      min-width: 0;
      border: 0;
      padding: var(--ds-textarea-padding-y, 14px) var(--ds-textarea-padding-x, 16px);
      border-radius: inherit;
      background: transparent;
      color: var(--ds-textarea-text-color, var(--ds-color-text, #111111));
      font: inherit;
      line-height: 1.6;
      resize: vertical;
      box-sizing: border-box;
    }

    textarea:focus {
      outline: none;
    }

    textarea::placeholder {
      color: var(--ds-textarea-placeholder-color, var(--ds-color-input-placeholder, #9ca3af));
    }

    :host([disabled]) .control {
      background: var(--ds-textarea-disabled-bg, #f3f4f6);
      box-shadow: none;
    }

    :host([disabled]) textarea {
      opacity: var(--ds-textarea-disabled-opacity, 0.56);
      cursor: not-allowed;
    }

    :host([readonly]) .control {
      background: var(--ds-textarea-readonly-bg, #fafafa);
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

    const fieldClass = this.error ? 'field field-error' : 'field';

    return html`
      <label class=${fieldClass} part="field">
        ${labelTemplate}
        <div class="control" part="control">
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
        </div>
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
