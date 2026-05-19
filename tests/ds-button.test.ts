import { describe, expect, it } from 'vitest';
import { DsButton } from '../src/components/ds-button';

describe('DsButton', () => {
  it('renders slotted content inside the native button', async () => {
    document.body.innerHTML = '';
    const element = new DsButton();
    element.textContent = 'Save';
    document.body.append(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.querySelector('slot')).toBeTruthy();
    expect(element.textContent).toContain('Save');
  });

  it('forwards disabled state to the native button', async () => {
    document.body.innerHTML = '';
    const element = new DsButton();
    element.disabled = true;
    element.textContent = 'Disabled';
    document.body.append(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('forwards button type to the native button', async () => {
    document.body.innerHTML = '';
    const element = new DsButton();
    element.type = 'button';
    element.textContent = 'Cancel';
    document.body.append(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.type).toBe('button');
  });
});
