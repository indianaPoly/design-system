import { describe, expect, it } from 'vitest';
import { DsButton } from '../src/components/ds-button';

describe('DsButton', () => {
  it('renders slotted content inside the native button', async () => {
    document.body.innerHTML = '<ds-button>Save</ds-button>';
    const element = document.querySelector('ds-button') as DsButton;
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.textContent).toContain('Save');
  });

  it('forwards disabled state to the native button', async () => {
    document.body.innerHTML = '<ds-button disabled>Disabled</ds-button>';
    const element = document.querySelector('ds-button') as DsButton;
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.disabled).toBe(true);
  });
});
