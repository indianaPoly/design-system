import { describe, expect, it } from 'vitest';
import { DsCheckbox } from '../src/components/ds-checkbox';

describe('DsCheckbox', () => {
  it('reflects checked state to input', async () => {
    document.body.innerHTML = '<ds-checkbox checked>동의</ds-checkbox>';
    const element = document.querySelector('ds-checkbox') as DsCheckbox;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('updates checked on change', async () => {
    document.body.innerHTML = '<ds-checkbox>동의</ds-checkbox>';
    const element = document.querySelector('ds-checkbox') as DsCheckbox;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });
});
