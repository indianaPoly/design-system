import { describe, expect, it } from 'vitest';
import { DsCheckbox } from '../src/components/ds-checkbox';
import { DsInput } from '../src/components/ds-input';
import { DsRadio } from '../src/components/ds-radio';
import { DsSwitch } from '../src/components/ds-switch';
import { DsTextarea } from '../src/components/ds-textarea';

describe('form integration', () => {
  it('submits values through FormData', async () => {
    document.body.innerHTML = '';

    const form = document.createElement('form');

    const input = new DsInput();
    input.name = 'email';
    input.value = 'name@example.com';

    const textarea = new DsTextarea();
    textarea.name = 'memo';
    textarea.value = 'A short note';

    const checkbox = new DsCheckbox();
    checkbox.name = 'agree';
    checkbox.checked = true;
    checkbox.value = 'yes';

    const radioA = new DsRadio();
    radioA.name = 'plan';
    radioA.value = 'basic';

    const radioB = new DsRadio();
    radioB.name = 'plan';
    radioB.value = 'pro';
    radioB.checked = true;

    const toggle = new DsSwitch();
    toggle.name = 'notifications';
    toggle.checked = true;
    toggle.value = 'enabled';

    form.append(input, textarea, checkbox, radioA, radioB, toggle);
    document.body.append(form);

    await Promise.all([
      input.updateComplete,
      textarea.updateComplete,
      checkbox.updateComplete,
      radioA.updateComplete,
      radioB.updateComplete,
      toggle.updateComplete,
    ]);

    const formData: Array<[string, string]> = [];
    new FormData(form).forEach((value, key) => {
      formData.push([key, String(value)]);
    });

    expect(formData).toEqual([
      ['email', 'name@example.com'],
      ['memo', 'A short note'],
      ['agree', 'yes'],
      ['plan', 'pro'],
      ['notifications', 'enabled'],
    ]);
  });

  it('resets controls to their initial state', async () => {
    document.body.innerHTML = '';

    const form = document.createElement('form');

    const input = new DsInput();
    input.name = 'email';
    input.value = 'before@example.com';

    const checkbox = new DsCheckbox();
    checkbox.name = 'agree';
    checkbox.checked = true;

    const radioA = new DsRadio();
    radioA.name = 'plan';
    radioA.value = 'basic';
    radioA.checked = true;

    const radioB = new DsRadio();
    radioB.name = 'plan';
    radioB.value = 'pro';

    form.append(input, checkbox, radioA, radioB);
    document.body.append(form);
    await Promise.all([
      input.updateComplete,
      checkbox.updateComplete,
      radioA.updateComplete,
      radioB.updateComplete,
    ]);

    input.value = 'after@example.com';
    checkbox.checked = false;
    radioB.checked = true;
    await Promise.all([
      input.updateComplete,
      checkbox.updateComplete,
      radioA.updateComplete,
      radioB.updateComplete,
    ]);

    form.reset();
    await Promise.all([
      input.updateComplete,
      checkbox.updateComplete,
      radioA.updateComplete,
      radioB.updateComplete,
    ]);

    expect(input.value).toBe('before@example.com');
    expect(checkbox.checked).toBe(true);
    expect(radioA.checked).toBe(true);
    expect(radioB.checked).toBe(false);
  });

  it('keeps radios mutually exclusive inside the same group', async () => {
    document.body.innerHTML = '';

    const first = new DsRadio();
    first.name = 'plan';
    first.value = 'basic';
    first.checked = true;

    const second = new DsRadio();
    second.name = 'plan';
    second.value = 'pro';

    document.body.append(first, second);
    await Promise.all([first.updateComplete, second.updateComplete]);

    const secondInput = second.shadowRoot?.querySelector('input') as HTMLInputElement;
    secondInput.checked = true;
    secondInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await Promise.all([first.updateComplete, second.updateComplete]);

    expect(first.checked).toBe(false);
    expect(second.checked).toBe(true);
  });

  it('supports required validation for checkbox, radio, and switch', async () => {
    document.body.innerHTML = '';

    const checkbox = new DsCheckbox();
    checkbox.required = true;

    const radioA = new DsRadio();
    radioA.name = 'billing';
    radioA.required = true;

    const radioB = new DsRadio();
    radioB.name = 'billing';

    const toggle = new DsSwitch();
    toggle.required = true;

    document.body.append(checkbox, radioA, radioB, toggle);
    await Promise.all([
      checkbox.updateComplete,
      radioA.updateComplete,
      radioB.updateComplete,
      toggle.updateComplete,
    ]);

    expect(checkbox.checkValidity()).toBe(false);
    expect(radioA.checkValidity()).toBe(false);
    expect(toggle.checkValidity()).toBe(false);

    checkbox.checked = true;
    radioB.checked = true;
    toggle.checked = true;
    await Promise.all([
      checkbox.updateComplete,
      radioA.updateComplete,
      radioB.updateComplete,
      toggle.updateComplete,
    ]);

    expect(checkbox.checkValidity()).toBe(true);
    expect(radioA.checkValidity()).toBe(true);
    expect(toggle.checkValidity()).toBe(true);
  });
});
