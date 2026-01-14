import { describe, expect, it } from 'vitest';
import { DsBadge } from '../src/components/ds-badge';

describe('DsBadge', () => {
  it('renders slotted content', async () => {
    document.body.innerHTML = '<ds-badge>New</ds-badge>';
    const element = document.querySelector('ds-badge') as DsBadge;
    await element.updateComplete;

    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge?.textContent).toContain('New');
  });
});
