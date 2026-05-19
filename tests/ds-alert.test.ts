import { describe, expect, it } from 'vitest';
import { DsAlert } from '../src/components/ds-alert';

describe('DsAlert', () => {
  it('renders title and body content', async () => {
    document.body.innerHTML = '';
    const element = new DsAlert();
    element.title = '알림';
    element.textContent = '내용';
    document.body.append(element);
    await element.updateComplete;

    const title = element.shadowRoot?.querySelector('.title');
    const body = element.shadowRoot?.querySelector('.body');

    expect(title?.textContent).toContain('알림');
    expect(body?.querySelector('slot')).toBeTruthy();
    expect(element.textContent).toContain('내용');
  });

  it('hides the title region when no title is provided', async () => {
    document.body.innerHTML = '';
    const element = new DsAlert();
    element.textContent = '내용';
    document.body.append(element);
    await element.updateComplete;

    const title = element.shadowRoot?.querySelector('.title');
    expect(title?.hasAttribute('hidden')).toBe(true);
  });
});
