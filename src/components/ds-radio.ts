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

@customElement('ds-radio')
export class DsRadio extends LitElement {
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

  private readonly inputId = `ds-radio-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  private defaultChecked = false;

  private hasCapturedDefault = false;

  constructor() {
    super();
    this.internals = this.attachInternals?.() ?? null;
    this.checked = false;
    this.disabled = false;
    this.required = false;
    this.name = '';
    this.value = '';
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
    if (this.checked) {
      this.uncheckPeers();
    }
    this.syncFormValue();
  }

  disconnectedCallback() {
    this.removeFormResetListener?.();
    this.removeFormResetListener = null;
    super.disconnectedCallback();
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('checked') && this.checked) {
      this.uncheckPeers();
    }

    if (
      changedProperties.has('checked')
      || changedProperties.has('name')
      || changedProperties.has('disabled')
      || changedProperties.has('value')
    ) {
      this.syncFormValue();
    }

    if (
      changedProperties.has('checked')
      || changedProperties.has('required')
      || changedProperties.has('name')
    ) {
      this.syncGroupValidity();
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
    this.syncGroupValidity();
    return this.groupMembers.some((radio) => radio.required)
      ? this.groupMembers.some((radio) => radio.checked)
      : true;
  }

  reportValidity() {
    this.syncGroupValidity();
    return this.checkValidity();
  }

  private get inputElement() {
    return this.shadowRoot?.querySelector('input') ?? null;
  }

  private syncFormValue() {
    const shouldOmitValue = this.disabled
      || !this.name
      || !this.checked;

    if (supportsFormValue(this.internals)) {
      this.internals.setFormValue(shouldOmitValue ? null : this.value || 'on');
      return;
    }

    this.proxyInput = syncHiddenFormProxy({
      host: this,
      proxyInput: this.proxyInput,
      name: this.name,
      value: this.value || 'on',
      shouldSubmit: !shouldOmitValue,
    });
  }

  private isSameGroup(other: DsRadio) {
    const thisForm = this.form;
    const otherForm = other.form;

    if (thisForm || otherForm) {
      return thisForm === otherForm;
    }

    return this.getRootNode() === other.getRootNode();
  }

  private get groupMembers() {
    const radios = Array.from(document.querySelectorAll('ds-radio')) as DsRadio[];
    return radios.filter(
      (radio) => radio.name === this.name && this.isSameGroup(radio),
    );
  }

  private syncValidity() {
    const input = this.inputElement;
    if (!input) {
      return;
    }

    const { groupMembers } = this;
    const isRequired = groupMembers.some((radio) => radio.required);
    const isChecked = groupMembers.some((radio) => radio.checked);
    const isValid = !isRequired || isChecked;
    const message = isValid ? '' : 'Please select an option.';

    input.setCustomValidity(message);

    if (supportsSetValidity(this.internals)) {
      this.internals.setValidity(isValid ? {} : { valueMissing: true }, message, input);
    }
  }

  private syncGroupValidity() {
    this.groupMembers.forEach((radio) => {
      radio.syncValidity();
    });
  }

  private uncheckSelf() {
    this.checked = false;
  }

  private uncheckPeers() {
    if (!this.name) {
      return;
    }

    const radios = Array.from(document.querySelectorAll('ds-radio')) as DsRadio[];

    radios
      .filter((radio) => radio !== this && radio.name === this.name && this.isSameGroup(radio))
      .forEach((radio) => {
        if (radio.checked) {
          radio.uncheckSelf();
        }
      });

    this.syncGroupValidity();
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(
        --ds-radio-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
      color: var(--ds-radio-color, var(--ds-color-text, #111111));

      /* Local variable bridging */
      --_gap: var(--ds-radio-gap, 12px);
      --_min-height: var(--ds-radio-min-height, 44px);
      --_font-size: var(--ds-radio-font-size, 0.9375rem);
      --_font-weight: var(--ds-radio-font-weight, 500);
      --_letter-spacing: var(--ds-radio-letter-spacing, -0.01em);
      --_size: var(--ds-radio-size, 20px);
      --_dot-size: var(--ds-radio-dot-size, calc(var(--_size) * 0.38));
      --_dot-color: var(--ds-radio-dot-color, var(--ds-color-on-primary, #ffffff));
      --_border-color: var(--ds-radio-border-color, var(--ds-color-border-strong, #d4d4d8));
      --_border-width: var(--ds-radio-border-width, 1.5px);
      --_border: var(--ds-radio-border, var(--_border-width) solid var(--_border-color));
      --_bg: var(--ds-radio-bg, #ffffff);
      --_shadow: var(--ds-radio-shadow, var(--ds-shadow-inset, inset 0 1px 0 rgba(255, 255, 255, 0.72)));
      --_hover-border-color: var(--ds-radio-hover-border-color, var(--ds-color-accent, var(--ds-color-text, #111111)));
      --_checked-border: var(--ds-radio-border-checked, var(--_border-width) solid var(--ds-color-primary, #111111));
      --_checked-bg: var(--ds-radio-bg-checked, var(--ds-color-primary, #111111));
      --_focus-shadow: var(
        --ds-radio-focus-shadow,
        0 0 0 4px var(--ds-radio-focus-ring, rgba(17, 17, 17, 0.1))
      );
      --_disabled-opacity: var(--ds-radio-disabled-opacity, 0.56);
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
      border-radius: 999px;
      border: var(--_border);
      background: var(--_bg);
      box-shadow: var(--_shadow);
      display: inline-grid;
      place-items: center;
      transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    input::after {
      content: '';
      width: var(--_dot-size);
      height: var(--_dot-size);
      border-radius: 999px;
      background: var(--_dot-color);
      transform: scale(0);
      transition: transform 0.18s ease;
    }

    label:hover input:not(:disabled) {
      border-color: var(--_hover-border-color);
    }

    input:checked {
      border: var(--_checked-border);
      background: var(--_checked-bg);
      box-shadow: none;
    }

    input:checked::after {
      transform: scale(1);
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
          part="radio"
          type="radio"
          ?checked=${this.checked}
          ?disabled=${isDisabled}
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
    'ds-radio': DsRadio;
  }
}
