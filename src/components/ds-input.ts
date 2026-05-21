import {
  css,
  html,
  LitElement,
  type PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { bindFormReset, supportsFormValue, syncHiddenFormProxy } from './internal/form-proxy';

export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';

@customElement('ds-input')
export class DsInput extends LitElement {
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
  declare maxLength: number | undefined;

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

  private readonly internals: ElementInternals | null;

  private proxyInput: HTMLInputElement | null = null;

  private removeFormResetListener: (() => void) | null = null;

  private readonly inputId = `ds-input-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  private defaultValue = '';

  private hasCapturedDefault = false;

  @state()
  declare private hasPrefixSlot: boolean;

  @state()
  declare private hasSuffixSlot: boolean;

  constructor() {
    super();
    this.internals = this.attachInternals?.() ?? null;
    this.label = '';
    this.helper = '';
    this.error = '';
    this.value = '';
    this.placeholder = '';
    this.name = '';
    this.maxLength = undefined;
    this.autocomplete = '';
    this.min = '';
    this.max = '';
    this.step = '';
    this.type = 'text';
    this.disabled = false;
    this.required = false;
    this.readonly = false;
    this.hasPrefixSlot = false;
    this.hasSuffixSlot = false;
  }

  get form() {
    return this.internals?.form ?? this.closest('form');
  }

  get validity() {
    return this.inputElement?.validity ?? this.internals?.validity;
  }

  get validationMessage() {
    return this.inputElement?.validationMessage ?? this.internals?.validationMessage ?? '';
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (!this.hasCapturedDefault && (changedProperties.has('value') || changedProperties.has('name'))) {
      this.defaultValue = this.value;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.hasPrefixSlot = this.querySelector('[slot="prefix"]') !== null;
    this.hasSuffixSlot = this.querySelector('[slot="suffix"]') !== null;
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
    this.inputElement?.focus(options);
  }

  checkValidity() {
    return this.inputElement?.checkValidity() ?? true;
  }

  reportValidity() {
    return this.inputElement?.reportValidity() ?? true;
  }

  private get inputElement() {
    return this.shadowRoot?.querySelector('input') ?? null;
  }

  private get helperId() {
    return `${this.inputId}-helper`;
  }

  private get errorId() {
    return `${this.inputId}-error`;
  }

  private get counterId() {
    return `${this.inputId}-counter`;
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
        --ds-input-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
      color: var(--ds-color-text, #111111);

      /* Local variable bridging for easier customization */
      --_border-color: var(--ds-input-border-color, var(--ds-color-input-border, #e4e4e7));
      --_border-width: var(--ds-input-border-width, 1px);
      --_border: var(--ds-input-border, var(--_border-width) solid var(--_border-color));
      --_radius: var(--ds-input-radius, var(--ds-radius-md, 16px));
      --_bg: var(--ds-input-bg, #ffffff);
      --_shadow: var(--ds-input-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.72));
      --_min-height: var(--ds-input-min-height, 52px);
      --_padding-inline: var(--ds-input-padding-inline, 4px);
      --_input-padding: var(--ds-input-padding, var(--ds-input-padding-y, 14px) 12px);
      --_focus-border-color: var(--ds-input-border-focus-color, var(--ds-color-primary, #111111));
      --_focus-border: var(--ds-input-border-focus, var(--_border-width) solid var(--_focus-border-color));
      --_focus-shadow: var(--ds-input-focus-shadow, var(--ds-input-focus-ring, 0 0 0 4px rgba(17, 17, 17, 0.1)));
      --_error-border: var(--ds-input-border-error, var(--_border-width) solid var(--ds-color-danger, #27272a));
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
      gap: 4px;
      min-height: var(--_min-height);
      padding-inline: var(--_padding-inline);
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
      box-shadow: var(--ds-input-error-shadow, 0 0 0 4px rgba(39, 39, 42, 0.08));
    }

    input {
      appearance: none;
      width: 100%;
      flex: 1;
      min-width: 0;
      border: 0;
      padding: var(--_input-padding);
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

    :host([disabled]) .control,
    :host([data-form-disabled]) .control {
      background: var(--ds-input-disabled-bg, #f3f4f6);
      box-shadow: none;
    }

    :host([disabled]) input,
    :host([data-form-disabled]) input {
      opacity: var(--ds-input-disabled-opacity, 0.56);
      cursor: not-allowed;
    }

    :host([readonly]) .control {
      background: var(--ds-input-readonly-bg, #fafafa);
    }

    .adornment {
      display: inline-flex;
      align-items: center;
      color: var(--ds-color-muted, #6b7280);
      font-size: 0.875rem;
      line-height: 1;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .adornment-prefix {
      padding-left: 12px;
    }

    .adornment-suffix {
      padding-right: 12px;
    }

    .adornment[hidden] {
      display: none;
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
      color: var(--ds-color-muted, #6b7280);
      line-height: 1.4;
    }

    .message.error {
      color: var(--ds-color-danger, #27272a);
      font-weight: 600;
    }

    .counter {
      font-size: 0.75rem;
      color: var(--ds-color-muted, #6b7280);
      line-height: 1.4;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .meta-spacer {
      flex: 1;
      min-width: 0;
    }

    .counter[hidden],
    .meta[hidden] {
      display: none;
    }
  `;

  private handleSlotChange(slotName: 'prefix' | 'suffix', event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.updateSlotState(slotName, slot);
  }

  private updateSlotState(slotName: 'prefix' | 'suffix', slot: HTMLSlotElement) {
    const hasContent = slot.assignedNodes({ flatten: true }).length > 0;

    if (slotName === 'prefix') {
      this.hasPrefixSlot = hasContent;
      return;
    }

    this.hasSuffixSlot = hasContent;
  }

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
    ]
      .filter(Boolean)
      .join(' ') || undefined;
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
          <span class="adornment adornment-prefix" part="prefix" ?hidden=${!this.hasPrefixSlot}>
            <slot name="prefix" @slotchange=${(event: Event) => this.handleSlotChange('prefix', event)}></slot>
          </span>
          <input
            id=${this.inputId}
            part="input"
            .value=${this.value}
            type=${this.type}
            placeholder=${this.placeholder}
            name=${this.name}
            autocomplete=${this.autocomplete}
            maxlength=${ifDefined(this.maxLength)}
            min=${ifDefined(this.min || undefined)}
            max=${ifDefined(this.max || undefined)}
            step=${ifDefined(this.step || undefined)}
            ?disabled=${isDisabled}
            ?required=${this.required}
            ?readonly=${this.readonly}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${ifDefined(describedBy)}
            @input=${this.handleInput}
            @change=${this.handleChange}
          />
          <span class="adornment adornment-suffix" part="suffix" ?hidden=${!this.hasSuffixSlot}>
            <slot name="suffix" @slotchange=${(event: Event) => this.handleSlotChange('suffix', event)}></slot>
          </span>
        </div>
        <div class="meta" part="meta" ?hidden=${!messageTemplate && !counterTemplate}>
          ${messageTemplate ?? html`<span class="meta-spacer" aria-hidden="true"></span>`}
          ${counterTemplate}
        </div>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-input': DsInput;
  }
}
