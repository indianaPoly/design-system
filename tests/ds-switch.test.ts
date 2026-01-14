import { describe, expect, it } from 'vitest';
import { DsSwitch } from '../src/components/ds-switch';

describe('DsSwitch', () => {
  it('reflects checked state to input', async () => {
    document.body.innerHTML = '<ds-switch checked>알림</ds-switch>';
    const element = document.querySelector('ds-switch') as DsSwitch;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('updates checked on change', async () => {
    document.body.innerHTML = '<ds-switch>알림</ds-switch>';
    const element = document.querySelector('ds-switch') as DsSwitch;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });
});
