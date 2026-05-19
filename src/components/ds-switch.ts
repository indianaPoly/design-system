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

@customElement('ds-switch')
export class DsSwitch extends LitElement {
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

  private readonly inputId = `ds-switch-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

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
    const message = isValid ? '' : 'Please enable this option.';

    input.setCustomValidity(message);

    if (supportsSetValidity(this.internals)) {
      this.internals.setValidity(isValid ? {} : { valueMissing: true }, message, input);
    }
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(
        --ds-switch-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
      color: var(--ds-color-text, #111111);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-switch-gap, 12px);
      min-height: 44px;
      cursor: pointer;
      font-size: 0.9375rem;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    .track {
      position: relative;
      width: var(--ds-switch-track-width, 46px);
      height: var(--ds-switch-track-height, 28px);
      border-radius: var(--ds-switch-track-radius, 999px);
      background: var(--ds-switch-track-bg, #d4d4d8);
      transition: background 0.18s ease, box-shadow 0.18s ease;
      flex-shrink: 0;
    }

    .thumb {
      position: absolute;
      top: var(--ds-switch-thumb-inset, 2px);
      left: var(--ds-switch-thumb-inset, 2px);
      width: var(--ds-switch-thumb-size, 24px);
      height: var(--ds-switch-thumb-size, 24px);
      border-radius: 50%;
      background: var(--ds-switch-thumb-bg, #ffffff);
      box-shadow: var(--ds-switch-thumb-shadow, 0 4px 10px rgba(17, 17, 17, 0.16));
      transition: transform 0.18s ease;
    }

    label:focus-within .track {
      box-shadow: var(--ds-switch-focus-shadow, 0 0 0 4px var(--ds-switch-focus-ring, rgba(17, 17, 17, 0.1)));
    }

    input {
      position: absolute;
      opacity: 0;
      width: 1px;
      height: 1px;
      margin: -1px;
      border: 0;
      padding: 0;
    }

    :host([checked]) .track {
      background: var(--ds-switch-track-bg-checked, var(--ds-color-primary, #111111));
    }

    :host([checked]) .thumb {
      transform: translateX(
        calc(
          var(--ds-switch-track-width, 46px) - var(--ds-switch-thumb-size, 24px) -
            (var(--ds-switch-thumb-inset, 2px) * 2)
        )
      );
    }

    .text {
      line-height: 1.45;
    }

    :host([disabled]) label,
    :host([data-form-disabled]) label {
      cursor: not-allowed;
      opacity: var(--ds-switch-disabled-opacity, 0.56);
    }

    :host([disabled]) .track,
    :host([data-form-disabled]) .track {
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
        <span class="track" part="track">
          <span class="thumb" part="thumb"></span>
        </span>
        <input
          id=${this.inputId}
          part="switch"
          type="checkbox"
          role="switch"
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
    'ds-switch': DsSwitch;
  }
}
