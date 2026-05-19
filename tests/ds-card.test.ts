import { describe, expect, it } from 'vitest';
import { DsCard } from '../src/components/ds-card';

describe('DsCard', () => {
  it('renders header/body/footer slots', async () => {
    document.body.innerHTML = '';
    const element = new DsCard();
    document.body.append(element);
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector('[part="card"]');
    const header = element.shadowRoot?.querySelector('[part="header"]');
    const body = element.shadowRoot?.querySelector('[part="body"]');
    const footer = element.shadowRoot?.querySelector('[part="footer"]');

    expect(card).toBeTruthy();
    expect(header?.querySelector('slot[name="header"]')).toBeTruthy();
    expect(body?.querySelector('slot:not([name])')).toBeTruthy();
    expect(footer?.querySelector('slot[name="footer"]')).toBeTruthy();
  });

  it('reflects elevation to the host attribute', async () => {
    document.body.innerHTML = '';
    const element = new DsCard();
    document.body.append(element);
    await element.updateComplete;

    element.elevation = 2;
    await element.updateComplete;

    expect(element.getAttribute('elevation')).toBe('2');
  });

  it('hides empty header and footer regions', async () => {
    document.body.innerHTML = '';
    const element = new DsCard();
    element.textContent = 'Body only';
    document.body.append(element);
    await element.updateComplete;

    const header = element.shadowRoot?.querySelector('[part="header"]');
    const footer = element.shadowRoot?.querySelector('[part="footer"]');

    expect(header?.hasAttribute('hidden')).toBe(true);
    expect(footer?.hasAttribute('hidden')).toBe(true);
  });
});
