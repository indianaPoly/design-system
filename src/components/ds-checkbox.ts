import {
  css,
  html,
  LitElement,
  type PropertyValues,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  bindFormReset,
  supportsFormValue,
  supportsSetValidity,
  syncHiddenFormProxy,
} from './internal/form-proxy';

@customElement('ds-checkbox')
export class DsCheckbox extends LitElement {
  static readonly formAssociated = true;

  @property({ type: Boolean, reflect: true })
  declare checked: boolean;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property({ type: Boolean, reflect: true })
  declare required: boolean;

  @property({ type: String, reflect: true })
  declare name: string;

  @property({ type: String })
  declare value: string;

  private readonly internals: ElementInternals | null;

  private proxyInput: HTMLInputElement | null = null;

  private removeFormResetListener: (() => void) | null = null;

  private readonly inputId = `ds-checkbox-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  private defaultChecked = false;

  private hasCapturedDefault = false;

  constructor() {
    super();
    this.internals = this.attachInternals?.() ?? null;
    this.checked = false;
    this.disabled = false;
    this.required = false;
    this.name = '';
    this.value = 'on';
  }

  get form() {
    return this.internals?.form ?? this.closest('form');
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (!this.hasCapturedDefault && changedProperties.has('checked')) {
      this.defaultChecked = this.checked;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasCapturedDefault) {
      this.defaultChecked = this.checked;
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
      changedProperties.has('checked')
      || changedProperties.has('name')
      || changedProperties.has('disabled')
      || changedProperties.has('value')
    ) {
      this.syncFormValue();
    }

    if (changedProperties.has('checked') || changedProperties.has('required')) {
      this.syncValidity();
    }
  }

  formResetCallback() {
    this.checked = this.defaultChecked;
  }

  formDisabledCallback(disabled: boolean) {
    this.toggleAttribute('data-form-disabled', disabled);
  }

  focus(options?: FocusOptions) {
    this.inputElement?.focus(options);
  }

  checkValidity() {
    this.syncValidity();
    return this.inputElement?.checkValidity() ?? true;
  }

  reportValidity() {
    this.syncValidity();
    return this.inputElement?.reportValidity() ?? true;
  }

  private get inputElement() {
    return this.shadowRoot?.querySelector('input') ?? null;
  }

  private syncFormValue() {
    const shouldOmitValue = this.disabled
      || !this.name
      || !this.checked;

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

  private syncValidity() {
    const input = this.inputElement;
    if (!input) {
      return;
    }

    const isValid = !this.required || this.checked;
    const message = isValid ? '' : 'Please check this option.';

    input.setCustomValidity(message);

    if (supportsSetValidity(this.internals)) {
      this.internals.setValidity(isValid ? {} : { valueMissing: true }, message, input);
    }
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

    :host([disabled]) label,
    :host([data-form-disabled]) label {
      cursor: not-allowed;
      opacity: var(--ds-checkbox-disabled-opacity, 0.56);
    }

    :host([disabled]) input,
    :host([data-form-disabled]) input {
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
    const isDisabled = this.disabled || this.hasAttribute('data-form-disabled');

    return html`
      <label part="label" for=${this.inputId}>
        <input
          id=${this.inputId}
          part="checkbox"
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${isDisabled}
          ?required=${this.required}
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
