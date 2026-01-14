import { describe, expect, it } from 'vitest';
import { DsRadio } from '../src/components/ds-radio';

describe('DsRadio', () => {
  it('reflects checked state to input', async () => {
    document.body.innerHTML = '<ds-radio checked>옵션</ds-radio>';
    const element = document.querySelector('ds-radio') as DsRadio;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('updates checked on change', async () => {
    document.body.innerHTML = '<ds-radio>옵션</ds-radio>';
    const element = document.querySelector('ds-radio') as DsRadio;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });
});
