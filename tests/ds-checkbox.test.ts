import { describe, expect, it } from 'vitest';
import { DsCheckbox } from '../src/components/ds-checkbox';

describe('DsCheckbox', () => {
  it('reflects checked state to input', async () => {
    document.body.innerHTML = '';
    const element = new DsCheckbox();
    element.checked = true;
    element.textContent = '동의';
    document.body.append(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('updates checked on change', async () => {
    document.body.innerHTML = '';
    const element = new DsCheckbox();
    element.textContent = '동의';
    document.body.append(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });

  it('re-dispatches a single change event from the host', async () => {
    document.body.innerHTML = '';
    const wrapper = document.createElement('div');
    let eventCount = 0;
    wrapper.addEventListener('change', () => {
      eventCount += 1;
    });

    const element = new DsCheckbox();
    wrapper.append(element);
    document.body.append(wrapper);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(eventCount).toBe(1);
  });
});
