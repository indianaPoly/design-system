import { describe, expect, it } from 'vitest';
import { DsSwitch } from '../src/components/ds-switch';

describe('DsSwitch', () => {
  it('reflects checked state to input', async () => {
    document.body.innerHTML = '';
    const element = new DsSwitch();
    element.checked = true;
    element.textContent = '알림';
    document.body.append(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('updates checked on change', async () => {
    document.body.innerHTML = '';
    const element = new DsSwitch();
    element.textContent = '알림';
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

    const element = new DsSwitch();
    wrapper.append(element);
    document.body.append(wrapper);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(eventCount).toBe(1);
  });
});
