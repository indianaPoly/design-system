import { describe, expect, it } from 'vitest';
import { DsTextarea } from '../src/components/ds-textarea';

describe('DsTextarea', () => {
  it('renders placeholder and updates value', async () => {
    document.body.innerHTML = '<ds-textarea placeholder="내용"></ds-textarea>';
    const element = document.querySelector('ds-textarea') as DsTextarea;
    await element.updateComplete;

    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea?.placeholder).toBe('내용');

    textarea.value = '메모';
    textarea.dispatchEvent(new Event('input'));
    await element.updateComplete;

    expect(element.value).toBe('메모');
  });
});
