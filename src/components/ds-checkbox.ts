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
      color: var(--ds-checkbox-color, var(--ds-color-text, #111111));

      /* Local variable bridging */
      --_gap: var(--ds-checkbox-gap, 12px);
      --_min-height: var(--ds-checkbox-min-height, 44px);
      --_font-size: var(--ds-checkbox-font-size, 0.9375rem);
      --_font-weight: var(--ds-checkbox-font-weight, 500);
      --_letter-spacing: var(--ds-checkbox-letter-spacing, -0.01em);
      --_size: var(--ds-checkbox-size, 20px);
      --_radius: var(--ds-checkbox-radius, 6px);
      --_border-color: var(--ds-checkbox-border-color, var(--ds-color-border-strong, #d4d4d8));
      --_border-width: var(--ds-checkbox-border-width, 1.5px);
      --_border: var(--ds-checkbox-border, var(--_border-width) solid var(--_border-color));
      --_bg: var(--ds-checkbox-bg, #ffffff);
      --_shadow: var(--ds-checkbox-shadow, var(--ds-shadow-inset, inset 0 1px 0 rgba(255, 255, 255, 0.72)));
      --_hover-border-color: var(--ds-checkbox-hover-border-color, var(--ds-color-accent, var(--ds-color-text, #111111)));
      --_checked-border-color: var(--ds-checkbox-border-checked, var(--ds-color-primary, #111111));
      --_checked-bg: var(--ds-checkbox-bg-checked, var(--ds-color-primary, #111111));
      --_focus-shadow: var(
        --ds-checkbox-focus-shadow,
        0 0 0 4px var(--ds-checkbox-focus-ring, rgba(17, 17, 17, 0.1))
      );
      --_disabled-opacity: var(--ds-checkbox-disabled-opacity, 0.56);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--_gap);
      min-height: var(--_min-height);
      cursor: pointer;
      font-size: var(--_font-size);
      font-weight: var(--_font-weight);
      letter-spacing: var(--_letter-spacing);
    }

    input {
      appearance: none;
      margin: 0;
      width: var(--_size);
      height: var(--_size);
      border-radius: var(--_radius);
      border: var(--_border);
      background: var(--_bg);
      box-shadow: var(--_shadow);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
      flex-shrink: 0;
      box-sizing: border-box;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 14px;
    }

    label:hover input:not(:disabled) {
      border-color: var(--_hover-border-color);
    }

    input:checked {
      border-color: var(--_checked-border-color);
      background-color: var(--_checked-bg);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'%3E%3C/path%3E%3C/svg%3E");
      box-shadow: none;
    }

    input:focus-visible {
      outline: none;
      box-shadow: var(--_focus-shadow);
    }

    .text {
      line-height: 1.45;
    }

    :host([disabled]) label,
    :host([data-form-disabled]) label {
      cursor: not-allowed;
      opacity: var(--_disabled-opacity);
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
