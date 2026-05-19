import { describe, expect, it } from 'vitest';
import { DsAlert } from '../src/components/ds-alert';
import { DsBadge } from '../src/components/ds-badge';
import { DsButton } from '../src/components/ds-button';
import { DsCard } from '../src/components/ds-card';
import { DsCheckbox } from '../src/components/ds-checkbox';
import { DsInput } from '../src/components/ds-input';
import { DsRadio } from '../src/components/ds-radio';
import { DsSwitch } from '../src/components/ds-switch';
import { DsTextarea } from '../src/components/ds-textarea';
import { serializeShadowRoot } from './snapshot-utils';

describe('component snapshots', () => {
  it('matches button variants and sizes', async () => {
    document.body.innerHTML = '';

    const primary = new DsButton();
    primary.textContent = 'Continue';

    const secondary = new DsButton();
    secondary.variant = 'secondary';
    secondary.size = 'sm';
    secondary.textContent = 'Later';

    const ghost = new DsButton();
    ghost.variant = 'ghost';
    ghost.size = 'lg';
    ghost.disabled = true;
    ghost.textContent = 'Details';

    document.body.append(primary, secondary, ghost);
    await Promise.all([primary.updateComplete, secondary.updateComplete, ghost.updateComplete]);

    expect({
      primary: serializeShadowRoot(primary),
      secondary: serializeShadowRoot(secondary),
      ghost: serializeShadowRoot(ghost),
    }).toMatchSnapshot();
  });

  it('matches card with all slots', async () => {
    document.body.innerHTML = '';

    const element = new DsCard();
    element.innerHTML = `
      <div slot="header">Header</div>
      <p>Body</p>
      <div slot="footer">Footer</div>
    `;

    document.body.append(element);
    await element.updateComplete;

    expect(serializeShadowRoot(element)).toMatchSnapshot();
  });

  it('matches input and textarea states', async () => {
    document.body.innerHTML = '';

    const input = new DsInput();
    input.label = 'Email';
    input.helper = 'We will send an invite link.';
    input.placeholder = 'name@example.com';
    input.required = true;
    input.maxLength = 50;
    input.innerHTML = `
      <span slot="prefix">@</span>
      <span slot="suffix">.com</span>
    `;

    const inputError = new DsInput();
    inputError.label = 'Phone';
    inputError.error = 'Digits only';
    inputError.value = '010-';

    const textarea = new DsTextarea();
    textarea.label = 'Memo';
    textarea.helper = 'Keep it concise.';
    textarea.placeholder = 'Write a short note';
    textarea.maxLength = 120;
    textarea.innerHTML = '<span slot="footer">Draft auto-saved</span>';

    const textareaError = new DsTextarea();
    textareaError.label = 'Reason';
    textareaError.error = 'Please provide more detail';
    textareaError.value = 'Too short';

    document.body.append(input, inputError, textarea, textareaError);
    await Promise.all([
      input.updateComplete,
      inputError.updateComplete,
      textarea.updateComplete,
      textareaError.updateComplete,
    ]);

    expect({
      input: serializeShadowRoot(input),
      inputError: serializeShadowRoot(inputError),
      textarea: serializeShadowRoot(textarea),
      textareaError: serializeShadowRoot(textareaError),
    }).toMatchSnapshot();
  });

  it('matches selection controls', async () => {
    document.body.innerHTML = '';

    const checkbox = new DsCheckbox();
    checkbox.checked = true;
    checkbox.textContent = 'Agree to terms';

    const checkboxDisabled = new DsCheckbox();
    checkboxDisabled.disabled = true;
    checkboxDisabled.textContent = 'Disabled option';

    const radio = new DsRadio();
    radio.name = 'plan';
    radio.checked = true;
    radio.textContent = 'Basic plan';

    const radioDisabled = new DsRadio();
    radioDisabled.name = 'plan';
    radioDisabled.disabled = true;
    radioDisabled.textContent = 'Enterprise plan';

    const switchOn = new DsSwitch();
    switchOn.checked = true;
    switchOn.textContent = 'Notifications';

    const switchOff = new DsSwitch();
    switchOff.disabled = true;
    switchOff.textContent = 'Auto save';

    document.body.append(checkbox, checkboxDisabled, radio, radioDisabled, switchOn, switchOff);
    await Promise.all([
      checkbox.updateComplete,
      checkboxDisabled.updateComplete,
      radio.updateComplete,
      radioDisabled.updateComplete,
      switchOn.updateComplete,
      switchOff.updateComplete,
    ]);

    expect({
      checkbox: serializeShadowRoot(checkbox),
      checkboxDisabled: serializeShadowRoot(checkboxDisabled),
      radio: serializeShadowRoot(radio),
      radioDisabled: serializeShadowRoot(radioDisabled),
      switchOn: serializeShadowRoot(switchOn),
      switchOff: serializeShadowRoot(switchOff),
    }).toMatchSnapshot();
  });

  it('matches status surfaces', async () => {
    document.body.innerHTML = '';

    const neutralBadge = new DsBadge();
    neutralBadge.textContent = 'Default';

    const primaryBadge = new DsBadge();
    primaryBadge.variant = 'primary';
    primaryBadge.textContent = 'Primary';

    const warningBadge = new DsBadge();
    warningBadge.variant = 'warning';
    warningBadge.textContent = 'Review';

    const alert = new DsAlert();
    alert.title = 'Update ready';
    alert.textContent = 'Switch to the latest version.';

    const alertDanger = new DsAlert();
    alertDanger.variant = 'danger';
    alertDanger.title = 'Request failed';
    alertDanger.textContent = 'Please try again later.';

    document.body.append(neutralBadge, primaryBadge, warningBadge, alert, alertDanger);
    await Promise.all([
      neutralBadge.updateComplete,
      primaryBadge.updateComplete,
      warningBadge.updateComplete,
      alert.updateComplete,
      alertDanger.updateComplete,
    ]);

    expect({
      neutralBadge: serializeShadowRoot(neutralBadge),
      primaryBadge: serializeShadowRoot(primaryBadge),
      warningBadge: serializeShadowRoot(warningBadge),
      alert: serializeShadowRoot(alert),
      alertDanger: serializeShadowRoot(alertDanger),
    }).toMatchSnapshot();
  });
});
