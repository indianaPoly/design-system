import { describe, expect, it } from 'vitest';
import { DsAlert } from '../src/components/ds-alert';

describe('DsAlert', () => {
  it('renders title and body content', async () => {
    document.body.innerHTML = '<ds-alert title="알림">내용</ds-alert>';
    const element = document.querySelector('ds-alert') as DsAlert;
    await element.updateComplete;

    const title = element.shadowRoot?.querySelector('.title');
    const body = element.shadowRoot?.querySelector('.body');

    expect(title?.textContent).toContain('알림');
    expect(body?.textContent).toContain('내용');
  });
});
