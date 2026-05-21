import {
  css,
  html,
  LitElement,
  type PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { bindFormReset, supportsFormValue, syncHiddenFormProxy } from './internal/form-proxy';

@customElement('ds-textarea')
export class DsTextarea extends LitElement {
  static readonly formAssociated = true;

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

  @property({ type: String, reflect: true })
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

  private readonly internals: ElementInternals | null;

  private proxyInput: HTMLInputElement | null = null;

  private removeFormResetListener: (() => void) | null = null;

  private readonly textareaId = `ds-textarea-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  private defaultValue = '';

  private hasCapturedDefault = false;

  @state()
  declare private hasFooterSlot: boolean;

  constructor() {
    super();
    this.internals = this.attachInternals?.() ?? null;
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
    this.hasFooterSlot = false;
  }

  get form() {
    return this.internals?.form ?? this.closest('form');
  }

  get validity() {
    return this.textareaElement?.validity ?? this.internals?.validity;
  }

  get validationMessage() {
    return this.textareaElement?.validationMessage ?? this.internals?.validationMessage ?? '';
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (!this.hasCapturedDefault && (changedProperties.has('value') || changedProperties.has('name'))) {
      this.defaultValue = this.value;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.hasFooterSlot = this.querySelector('[slot="footer"]') !== null;
    if (!this.hasCapturedDefault) {
      this.defaultValue = this.value;
      this.hasCapturedDefault = true;
    }
    if (!supportsFormValue(this.internals)) {
      this.removeFormResetListener = bindFormReset(
        this.form,
        () => this.formResetCallback(),
        this.removeFormResetListener,
      );
    }
    this.syncFormValue();
  }

  disconnectedCallback() {
    this.removeFormResetListener?.();
    this.removeFormResetListener = null;
    super.disconnectedCallback();
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has('value')
      || changedProperties.has('name')
      || changedProperties.has('disabled')
    ) {
      this.syncFormValue();
    }
  }

  formResetCallback() {
    this.value = this.defaultValue;
  }

  formDisabledCallback(disabled: boolean) {
    this.toggleAttribute('data-form-disabled', disabled);
  }

  focus(options?: FocusOptions) {
    this.textareaElement?.focus(options);
  }

  checkValidity() {
    return this.textareaElement?.checkValidity() ?? true;
  }

  reportValidity() {
    return this.textareaElement?.reportValidity() ?? true;
  }

  private get textareaElement() {
    return this.shadowRoot?.querySelector('textarea') ?? null;
  }

  private get helperId() {
    return `${this.textareaId}-helper`;
  }

  private get errorId() {
    return `${this.textareaId}-error`;
  }

  private get counterId() {
    return `${this.textareaId}-counter`;
  }

  private get footerId() {
    return `${this.textareaId}-footer`;
  }

  private get characterCount() {
    return this.value.length;
  }

  private get shouldShowCounter() {
    return typeof this.maxLength === 'number' && this.maxLength >= 0;
  }

  private syncFormValue() {
    const shouldOmitValue = this.disabled
      || !this.name;

    if (supportsFormValue(this.internals)) {
      this.internals.setFormValue(shouldOmitValue ? null : this.value);
      return;
    }

    this.proxyInput = syncHiddenFormProxy({
      host: this,
      proxyInput: this.proxyInput,
      name: this.name,
      value: this.value,
      shouldSubmit: !shouldOmitValue,
    });
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(
        --ds-textarea-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
      color: var(--ds-textarea-color, var(--ds-color-text, #111111));

      /* Local variable bridging */
      --_gap: var(--ds-textarea-gap, 10px);
      --_label-gap: var(--ds-textarea-label-gap, 4px);
      --_label-font-size: var(--ds-textarea-label-font-size, 0.9375rem);
      --_label-font-weight: var(--ds-textarea-label-font-weight, 600);
      --_label-letter-spacing: var(--ds-textarea-label-letter-spacing, -0.01em);
      --_border-color: var(--ds-textarea-border-color, var(--ds-color-input-border, #e4e4e7));
      --_border-width: var(--ds-textarea-border-width, 1px);
      --_border: var(--ds-textarea-border, var(--_border-width) solid var(--_border-color));
      --_radius: var(--ds-textarea-radius, var(--ds-radius-md, 16px));
      --_bg: var(--ds-textarea-bg, #ffffff);
      --_shadow: var(--ds-textarea-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.72));
      --_padding: var(--ds-textarea-padding, var(--ds-textarea-padding-y, 14px) var(--ds-textarea-padding-x, 16px));
      --_focus-border-color: var(--ds-textarea-border-focus-color, var(--ds-color-primary, #111111));
      --_focus-border: var(--ds-textarea-border-focus, var(--_border-width) solid var(--_focus-border-color));
      --_focus-shadow: var(--ds-textarea-focus-shadow, 0 0 0 4px rgba(17, 17, 17, 0.1));
      --_error-border: var(--ds-textarea-border-error, var(--_border-width) solid var(--ds-color-danger, #27272a));
      --_disabled-bg: var(--ds-textarea-disabled-bg, #f3f4f6);
      --_readonly-bg: var(--ds-textarea-readonly-bg, #fafafa);
      --_disabled-opacity: var(--ds-textarea-disabled-opacity, 0.56);
      --_message-color: var(--ds-textarea-message-color, var(--ds-color-muted, #6b7280));
      --_counter-color: var(--ds-textarea-counter-color, var(--ds-color-muted, #6b7280));
      --_footer-color: var(--ds-textarea-footer-color, var(--ds-color-muted, #6b7280));
    }

    .field {
      display: grid;
      gap: var(--_gap);
    }

    .label {
      display: inline-flex;
      align-items: center;
      gap: var(--_label-gap);
      font-size: var(--_label-font-size);
      font-weight: var(--_label-font-weight);
      letter-spacing: var(--_label-letter-spacing);
    }

    .required {
      color: var(--ds-color-danger, #27272a);
    }

    .control {
      display: flex;
      border: var(--_border);
      border-radius: var(--_radius);
      background: var(--_bg);
      box-shadow: var(--_shadow);
      transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
      box-sizing: border-box;
    }

    .field:focus-within .control {
      border: var(--_focus-border);
      box-shadow: var(--_focus-shadow);
    }

    .field.field-error .control {
      border: var(--_error-border);
      box-shadow: var(--ds-textarea-error-shadow, 0 0 0 4px rgba(39, 39, 42, 0.08));
    }

    textarea {
      width: 100%;
      min-width: 0;
      border: 0;
      padding: var(--_padding);
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

    :host([disabled]) .control,
    :host([data-form-disabled]) .control {
      background: var(--_disabled-bg);
      box-shadow: none;
    }

    :host([disabled]) textarea,
    :host([data-form-disabled]) textarea {
      opacity: var(--_disabled-opacity);
      cursor: not-allowed;
    }

    :host([readonly]) .control {
      background: var(--_readonly-bg);
    }

    .meta {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .message {
      flex: 1;
      min-width: 0;
      font-size: 0.8125rem;
      color: var(--_message-color);
      line-height: 1.4;
    }

    .message.error {
      color: var(--ds-color-danger, #27272a);
      font-weight: 600;
    }

    .counter {
      font-size: 0.75rem;
      color: var(--_counter-color);
      line-height: 1.4;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .meta-spacer {
      flex: 1;
      min-width: 0;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      color: var(--_footer-color);
      font-size: 0.8125rem;
      line-height: 1.4;
    }

    .footer[hidden],
    .counter[hidden],
    .meta[hidden] {
      display: none;
    }
  `;

  private handleFooterSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.updateFooterSlotState(slot);
  }

  private updateFooterSlotState(slot: HTMLSlotElement) {
    this.hasFooterSlot = slot.assignedNodes({ flatten: true }).length > 0;
  }

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
    const describedBy = [
      messageText ? messageId : null,
      this.shouldShowCounter ? this.counterId : null,
      this.hasFooterSlot ? this.footerId : null,
    ].filter(Boolean).join(' ') || undefined;
    const counterTemplate = this.shouldShowCounter
      ? html`
          <span id=${this.counterId} class="counter" part="counter">
            ${this.characterCount}/${this.maxLength}
          </span>
        `
      : null;

    const fieldClass = this.error ? 'field field-error' : 'field';
    const isDisabled = this.disabled || this.hasAttribute('data-form-disabled');

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
            ?disabled=${isDisabled}
            ?required=${this.required}
            ?readonly=${this.readonly}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy)}
            @input=${this.handleInput}
            @change=${this.handleChange}
          ></textarea>
        </div>
        <div class="meta" part="meta" ?hidden=${!messageTemplate && !counterTemplate}>
          ${messageTemplate ?? html`<span class="meta-spacer" aria-hidden="true"></span>`}
          ${counterTemplate}
        </div>
        <div class="footer" part="footer" ?hidden=${!this.hasFooterSlot}>
          <slot id=${this.footerId} name="footer" @slotchange=${this.handleFooterSlotChange}></slot>
        </div>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-textarea': DsTextarea;
  }
}
