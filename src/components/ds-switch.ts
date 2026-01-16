import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('ds-switch')
export class DsSwitch extends LitElement {
  @property({ type: Boolean, reflect: true })
  declare checked: boolean;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property({ type: String })
  declare name: string;

  @property({ type: String })
  declare value: string;

  private inputId = `ds-switch-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
    this.name = '';
    this.value = 'on';
  }

  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(
        --ds-switch-font-family,
        var(--ds-font-family, "Inter", system-ui, -apple-system, sans-serif)
      );
      color: var(--ds-color-text, #111827);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-switch-gap, var(--ds-space-xs, 6px));
      cursor: pointer;
      min-height: 44px;
    }

    .track {
      position: relative;
      width: var(--ds-switch-track-width, 38px);
      height: var(--ds-switch-track-height, 22px);
      background: var(--ds-switch-track-bg, var(--ds-color-border, #e5e7eb));
      border-radius: var(--ds-switch-track-radius, 999px);
      transition: background 0.2s ease, box-shadow 0.2s ease;
    }

    .thumb {
      position: absolute;
      top: var(--ds-switch-thumb-inset, 2px);
      left: var(--ds-switch-thumb-inset, 2px);
      width: var(--ds-switch-thumb-size, 18px);
      height: var(--ds-switch-thumb-size, 18px);
      border-radius: 50%;
      background: var(--ds-switch-thumb-bg, #ffffff);
      box-shadow: var(--ds-switch-thumb-shadow, 0 2px 6px rgba(15, 23, 42, 0.2));
      transition: transform 0.2s ease;
    }

    label:focus-within .track {
      box-shadow: var(--ds-switch-focus-shadow, 0 0 0 3px var(--ds-switch-focus-ring, var(--ds-color-focus)));
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
      background: var(--ds-switch-track-bg-checked, var(--ds-color-primary, #2563eb));
    }

    :host([checked]) .thumb {
      transform: translateX(
        calc(
          var(--ds-switch-track-width, 38px) - var(--ds-switch-thumb-size, 18px) -
            (var(--ds-switch-thumb-inset, 2px) * 2)
        )
      );
    }

    :host([disabled]) label {
      cursor: not-allowed;
      opacity: var(--ds-switch-disabled-opacity, 0.6);
    }

    :host([disabled]) .track {
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
          ?disabled=${this.disabled}
          name=${ifDefined(this.name || undefined)}
          value=${this.value}
          @change=${this.handleChange}
        />
        <span part="text"><slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-switch': DsSwitch;
  }
}
