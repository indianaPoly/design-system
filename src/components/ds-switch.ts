import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('ds-switch')
export class DsSwitch extends LitElement {
  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  name = '';

  @property({ type: String })
  value = 'on';

  private inputId = `ds-switch-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`;

  static styles = css`
    :host {
      display: inline-flex;
      font-family: var(--ds-font-family, "Inter", system-ui, sans-serif);
      color: var(--ds-color-text, #111827);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-xs, 6px);
      cursor: pointer;
    }

    .track {
      position: relative;
      width: 38px;
      height: 22px;
      background: var(--ds-color-border, #e5e7eb);
      border-radius: 999px;
      transition: background 0.2s ease;
    }

    .thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
      transition: transform 0.2s ease;
    }

    input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    :host([checked]) .track {
      background: var(--ds-color-primary, #2563eb);
    }

    :host([checked]) .thumb {
      transform: translateX(16px);
    }

    :host([disabled]) label {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;

  private handleChange(event: Event) {
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
