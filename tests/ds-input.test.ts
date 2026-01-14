import { describe, expect, it } from 'vitest';
import { DsInput } from '../src/components/ds-input';

describe('DsInput', () => {
  it('renders label and helper text', async () => {
    document.body.innerHTML = '<ds-input label="이메일" helper="입력해주세요"></ds-input>';
    const element = document.querySelector('ds-input') as DsInput;
    await element.updateComplete;

    const label = element.shadowRoot?.querySelector('[part="label"]');
    const message = element.shadowRoot?.querySelector('[part="message"]');

    expect(label?.textContent).toContain('이메일');
    expect(message?.textContent).toContain('입력해주세요');
  });

  it('updates value on input events', async () => {
    document.body.innerHTML = '<ds-input></ds-input>';
    const element = document.querySelector('ds-input') as DsInput;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    await element.updateComplete;

    expect(element.value).toBe('hello');
  });
});
