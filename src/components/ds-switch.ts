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
      color: var(--ds-switch-color, var(--ds-color-text, #111111));

      /* Local variable bridging */
      --_gap: var(--ds-switch-gap, 12px);
      --_min-height: var(--ds-switch-min-height, 44px);
      --_font-size: var(--ds-switch-font-size, 0.9375rem);
      --_font-weight: var(--ds-switch-font-weight, 500);
      --_letter-spacing: var(--ds-switch-letter-spacing, -0.01em);
      --_track-width: var(--ds-switch-track-width, 46px);
      --_track-height: var(--ds-switch-track-height, 28px);
      --_track-radius: var(--ds-switch-track-radius, 999px);
      --_track-bg: var(--ds-switch-track-bg, #d4d4d8);
      --_track-bg-checked: var(--ds-switch-track-bg-checked, var(--ds-color-primary, #111111));
      --_track-hover-shadow: var(--ds-switch-track-hover-shadow, inset 0 0 0 1px var(--ds-color-border-strong, #d4d4d8));
      --_focus-shadow: var(
        --ds-switch-focus-shadow,
        0 0 0 4px var(--ds-switch-focus-ring, rgba(17, 17, 17, 0.1))
      );
      --_thumb-inset: var(--ds-switch-thumb-inset, 2px);
      --_thumb-size: var(--ds-switch-thumb-size, 24px);
      --_thumb-bg: var(--ds-switch-thumb-bg, #ffffff);
      --_thumb-shadow: var(--ds-switch-thumb-shadow, 0 4px 10px rgba(17, 17, 17, 0.16));
      --_thumb-translate: calc(var(--_track-width) - var(--_thumb-size) - (var(--_thumb-inset) * 2));
      --_disabled-opacity: var(--ds-switch-disabled-opacity, 0.56);
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

    .track {
      position: relative;
      width: var(--_track-width);
      height: var(--_track-height);
      border-radius: var(--_track-radius);
      background: var(--_track-bg);
      transition: background 0.18s ease, box-shadow 0.18s ease;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .thumb {
      position: absolute;
      top: var(--_thumb-inset);
      left: var(--_thumb-inset);
      width: var(--_thumb-size);
      height: var(--_thumb-size);
      border-radius: 50%;
      background: var(--_thumb-bg);
      box-shadow: var(--_thumb-shadow);
      transition: transform 0.18s ease;
    }

    label:hover .track {
      box-shadow: var(--_track-hover-shadow);
    }

    label:focus-within .track {
      box-shadow: var(--_focus-shadow);
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
      background: var(--_track-bg-checked);
    }

    :host([checked]) .thumb {
      transform: translateX(var(--_thumb-translate));
    }

    .text {
      line-height: 1.45;
    }

    :host([disabled]) label,
    :host([data-form-disabled]) label {
      cursor: not-allowed;
      opacity: var(--_disabled-opacity);
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
