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
});
