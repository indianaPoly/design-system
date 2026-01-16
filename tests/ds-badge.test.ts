import { describe, expect, it } from 'vitest';
import { DsBadge } from '../src/components/ds-badge';

describe('DsBadge', () => {
  it('renders slotted content', async () => {
    document.body.innerHTML = '';
    const element = new DsBadge();
    element.textContent = 'New';
    document.body.append(element);
    await element.updateComplete;

    const badge = element.shadowRoot?.querySelector('.badge');
    expect(badge).toBeTruthy();
    expect(badge?.querySelector('slot')).toBeTruthy();
    expect(element.textContent).toContain('New');
  });
});
