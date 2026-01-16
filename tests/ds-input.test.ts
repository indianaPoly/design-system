import { describe, expect, it } from 'vitest';
import { DsInput } from '../src/components/ds-input';

describe('DsInput', () => {
  it('renders label and helper text', async () => {
    document.body.innerHTML = '';
    const element = new DsInput();
    element.label = '이메일';
    element.helper = '입력해주세요';
    document.body.append(element);
    await element.updateComplete;

    const label = element.shadowRoot?.querySelector('[part="label"]');
    const message = element.shadowRoot?.querySelector('[part="message"]');

    expect(label?.textContent).toContain('이메일');
    expect(message?.textContent).toContain('입력해주세요');
  });

  it('updates value on input events', async () => {
    document.body.innerHTML = '';
    const element = new DsInput();
    document.body.append(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    await element.updateComplete;

    expect(element.value).toBe('hello');
  });

  it('re-dispatches a single input event from the host', async () => {
    document.body.innerHTML = '';
    const wrapper = document.createElement('div');
    let eventCount = 0;
    wrapper.addEventListener('input', () => {
      eventCount += 1;
    });

    const element = new DsInput();
    wrapper.append(element);
    document.body.append(wrapper);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(eventCount).toBe(1);
  });
});
