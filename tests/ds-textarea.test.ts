import { describe, expect, it } from 'vitest';
import { DsTextarea } from '../src/components/ds-textarea';

describe('DsTextarea', () => {
  it('renders placeholder and updates value', async () => {
    document.body.innerHTML = '';
    const element = new DsTextarea();
    element.placeholder = '내용';
    document.body.append(element);
    await element.updateComplete;

    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea?.placeholder).toBe('내용');

    textarea.value = '메모';
    textarea.dispatchEvent(new Event('input'));
    await element.updateComplete;

    expect(element.value).toBe('메모');
  });

  it('re-dispatches a single input event from the host', async () => {
    document.body.innerHTML = '';
    const wrapper = document.createElement('div');
    let eventCount = 0;
    wrapper.addEventListener('input', () => {
      eventCount += 1;
    });

    const element = new DsTextarea();
    wrapper.append(element);
    document.body.append(wrapper);
    await element.updateComplete;

    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(eventCount).toBe(1);
  });

  it('renders character count and footer slot content', async () => {
    document.body.innerHTML = '';
    const element = new DsTextarea();
    element.maxLength = 120;
    element.value = '메모';
    element.innerHTML = '<span slot="footer">자동 저장됨</span>';
    document.body.append(element);
    await element.updateComplete;

    const counter = element.shadowRoot?.querySelector('[part="counter"]');
    const footer = element.shadowRoot?.querySelector('[part="footer"]');
    const textarea = element.shadowRoot?.querySelector('textarea');

    expect(counter?.textContent?.trim()).toBe('2/120');
    expect(footer?.hasAttribute('hidden')).toBe(false);
    expect(textarea?.getAttribute('aria-describedby')).toContain('counter');
    expect(textarea?.getAttribute('aria-describedby')).toContain('footer');
  });
});
