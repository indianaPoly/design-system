import { describe, expect, it } from 'vitest';
import { type LitElement } from 'lit';
import { DsAlert } from '../src/components/ds-alert';
import { DsBadge } from '../src/components/ds-badge';
import { DsButton } from '../src/components/ds-button';
import { DsCard } from '../src/components/ds-card';
import { DsCheckbox } from '../src/components/ds-checkbox';
import { DsInput } from '../src/components/ds-input';
import { DsRadio } from '../src/components/ds-radio';
import { DsSwitch } from '../src/components/ds-switch';
import { DsTextarea } from '../src/components/ds-textarea';

type ComponentStyleContract = {
  readonly name: string;
  readonly create: () => LitElement;
  readonly legacyTokens: readonly string[];
  readonly dxTokens: readonly string[];
};

const componentStyleContracts: readonly ComponentStyleContract[] = [
  {
    name: 'ds-alert',
    create: () => new DsAlert(),
    legacyTokens: [
      '--ds-alert-bg',
      '--ds-alert-border-color',
      '--ds-alert-danger-accent',
      '--ds-alert-danger-bg',
      '--ds-alert-danger-border-color',
      '--ds-alert-font-family',
      '--ds-alert-gap',
      '--ds-alert-indicator-size',
      '--ds-alert-info-accent',
      '--ds-alert-info-bg',
      '--ds-alert-info-border-color',
      '--ds-alert-padding-x',
      '--ds-alert-padding-y',
      '--ds-alert-radius',
      '--ds-alert-shadow',
      '--ds-alert-success-accent',
      '--ds-alert-success-bg',
      '--ds-alert-success-border-color',
      '--ds-alert-text-color',
      '--ds-alert-title-weight',
      '--ds-alert-warning-accent',
      '--ds-alert-warning-bg',
      '--ds-alert-warning-border-color',
    ],
    dxTokens: [
      '--ds-alert-accent',
      '--ds-alert-body-color',
      '--ds-alert-border',
      '--ds-alert-indicator-offset',
    ],
  },
  {
    name: 'ds-badge',
    create: () => new DsBadge(),
    legacyTokens: [
      '--ds-badge-danger-bg',
      '--ds-badge-danger-border',
      '--ds-badge-danger-fg',
      '--ds-badge-font-family',
      '--ds-badge-font-size',
      '--ds-badge-font-weight',
      '--ds-badge-gap',
      '--ds-badge-neutral-bg',
      '--ds-badge-neutral-border',
      '--ds-badge-neutral-fg',
      '--ds-badge-padding-x',
      '--ds-badge-padding-y',
      '--ds-badge-primary-bg',
      '--ds-badge-primary-border',
      '--ds-badge-primary-fg',
      '--ds-badge-radius',
      '--ds-badge-success-bg',
      '--ds-badge-success-border',
      '--ds-badge-success-fg',
      '--ds-badge-warning-bg',
      '--ds-badge-warning-border',
      '--ds-badge-warning-fg',
    ],
    dxTokens: [
      '--ds-badge-bg',
      '--ds-badge-border',
      '--ds-badge-border-color',
      '--ds-badge-color',
      '--ds-badge-indicator-size',
    ],
  },
  {
    name: 'ds-button',
    create: () => new DsButton(),
    legacyTokens: [
      '--ds-button-disabled-opacity',
      '--ds-button-focus-ring',
      '--ds-button-focus-shadow',
      '--ds-button-font-family',
      '--ds-button-font-weight',
      '--ds-button-ghost-bg',
      '--ds-button-ghost-bg-active',
      '--ds-button-ghost-bg-hover',
      '--ds-button-ghost-border',
      '--ds-button-ghost-fg',
      '--ds-button-letter-spacing',
      '--ds-button-lg-font-size',
      '--ds-button-lg-min-height',
      '--ds-button-lg-padding-x',
      '--ds-button-lg-padding-y',
      '--ds-button-md-font-size',
      '--ds-button-md-min-height',
      '--ds-button-md-padding-x',
      '--ds-button-md-padding-y',
      '--ds-button-primary-bg',
      '--ds-button-primary-bg-active',
      '--ds-button-primary-bg-hover',
      '--ds-button-primary-border',
      '--ds-button-primary-fg',
      '--ds-button-radius',
      '--ds-button-secondary-bg',
      '--ds-button-secondary-bg-active',
      '--ds-button-secondary-bg-hover',
      '--ds-button-secondary-border',
      '--ds-button-secondary-fg',
      '--ds-button-shadow',
      '--ds-button-sm-font-size',
      '--ds-button-sm-min-height',
      '--ds-button-sm-padding-x',
      '--ds-button-sm-padding-y',
      '--ds-button-transition',
    ],
    dxTokens: [
      '--ds-button-bg',
      '--ds-button-bg-active',
      '--ds-button-bg-hover',
      '--ds-button-border',
      '--ds-button-color',
      '--ds-button-font-size',
      '--ds-button-min-height',
      '--ds-button-padding',
    ],
  },
  {
    name: 'ds-card',
    create: () => new DsCard(),
    legacyTokens: [
      '--ds-card-bg',
      '--ds-card-border',
      '--ds-card-font-family',
      '--ds-card-gap',
      '--ds-card-padding',
      '--ds-card-radius',
      '--ds-card-shadow',
      '--ds-card-shadow-elevation-0',
      '--ds-card-shadow-elevation-2',
    ],
    dxTokens: [
      '--ds-card-body-color',
      '--ds-card-color',
      '--ds-card-footer-color',
      '--ds-card-header-color',
    ],
  },
  {
    name: 'ds-checkbox',
    create: () => new DsCheckbox(),
    legacyTokens: [
      '--ds-checkbox-bg',
      '--ds-checkbox-bg-checked',
      '--ds-checkbox-border',
      '--ds-checkbox-border-checked',
      '--ds-checkbox-disabled-opacity',
      '--ds-checkbox-focus-ring',
      '--ds-checkbox-focus-shadow',
      '--ds-checkbox-font-family',
      '--ds-checkbox-gap',
      '--ds-checkbox-radius',
      '--ds-checkbox-size',
    ],
    dxTokens: [
      '--ds-checkbox-border-color',
      '--ds-checkbox-border-width',
      '--ds-checkbox-color',
      '--ds-checkbox-font-size',
      '--ds-checkbox-font-weight',
      '--ds-checkbox-hover-border-color',
      '--ds-checkbox-letter-spacing',
      '--ds-checkbox-min-height',
      '--ds-checkbox-shadow',
    ],
  },
  {
    name: 'ds-input',
    create: () => new DsInput(),
    legacyTokens: [
      '--ds-input-bg',
      '--ds-input-border',
      '--ds-input-border-error',
      '--ds-input-border-focus',
      '--ds-input-disabled-bg',
      '--ds-input-disabled-opacity',
      '--ds-input-error-shadow',
      '--ds-input-focus-shadow',
      '--ds-input-font-family',
      '--ds-input-min-height',
      '--ds-input-padding-y',
      '--ds-input-placeholder-color',
      '--ds-input-radius',
      '--ds-input-readonly-bg',
      '--ds-input-shadow',
      '--ds-input-text-color',
    ],
    dxTokens: [
      '--ds-input-border-color',
      '--ds-input-border-focus-color',
      '--ds-input-border-width',
      '--ds-input-focus-ring',
      '--ds-input-padding',
      '--ds-input-padding-inline',
    ],
  },
  {
    name: 'ds-radio',
    create: () => new DsRadio(),
    legacyTokens: [
      '--ds-radio-bg',
      '--ds-radio-bg-checked',
      '--ds-radio-border',
      '--ds-radio-border-checked',
      '--ds-radio-disabled-opacity',
      '--ds-radio-dot-color',
      '--ds-radio-focus-ring',
      '--ds-radio-focus-shadow',
      '--ds-radio-font-family',
      '--ds-radio-gap',
      '--ds-radio-size',
    ],
    dxTokens: [
      '--ds-radio-border-color',
      '--ds-radio-border-width',
      '--ds-radio-color',
      '--ds-radio-dot-size',
      '--ds-radio-font-size',
      '--ds-radio-font-weight',
      '--ds-radio-hover-border-color',
      '--ds-radio-letter-spacing',
      '--ds-radio-min-height',
      '--ds-radio-shadow',
    ],
  },
  {
    name: 'ds-switch',
    create: () => new DsSwitch(),
    legacyTokens: [
      '--ds-switch-disabled-opacity',
      '--ds-switch-focus-ring',
      '--ds-switch-focus-shadow',
      '--ds-switch-font-family',
      '--ds-switch-gap',
      '--ds-switch-thumb-bg',
      '--ds-switch-thumb-inset',
      '--ds-switch-thumb-shadow',
      '--ds-switch-thumb-size',
      '--ds-switch-track-bg',
      '--ds-switch-track-bg-checked',
      '--ds-switch-track-height',
      '--ds-switch-track-radius',
      '--ds-switch-track-width',
    ],
    dxTokens: [
      '--ds-switch-color',
      '--ds-switch-font-size',
      '--ds-switch-font-weight',
      '--ds-switch-letter-spacing',
      '--ds-switch-min-height',
      '--ds-switch-track-hover-shadow',
    ],
  },
  {
    name: 'ds-textarea',
    create: () => new DsTextarea(),
    legacyTokens: [
      '--ds-textarea-bg',
      '--ds-textarea-border',
      '--ds-textarea-border-error',
      '--ds-textarea-border-focus',
      '--ds-textarea-disabled-bg',
      '--ds-textarea-disabled-opacity',
      '--ds-textarea-error-shadow',
      '--ds-textarea-focus-shadow',
      '--ds-textarea-font-family',
      '--ds-textarea-padding-x',
      '--ds-textarea-padding-y',
      '--ds-textarea-placeholder-color',
      '--ds-textarea-radius',
      '--ds-textarea-readonly-bg',
      '--ds-textarea-shadow',
      '--ds-textarea-text-color',
    ],
    dxTokens: [
      '--ds-textarea-border-color',
      '--ds-textarea-border-focus-color',
      '--ds-textarea-border-width',
      '--ds-textarea-color',
      '--ds-textarea-counter-color',
      '--ds-textarea-footer-color',
      '--ds-textarea-gap',
      '--ds-textarea-label-font-size',
      '--ds-textarea-label-font-weight',
      '--ds-textarea-label-gap',
      '--ds-textarea-label-letter-spacing',
      '--ds-textarea-message-color',
      '--ds-textarea-padding',
    ],
  },
];

const getStyleText = async (element: LitElement) => {
  document.body.innerHTML = '';
  document.body.append(element);
  await element.updateComplete;

  return element.shadowRoot?.querySelector('style')?.textContent ?? '';
};

describe('component style token contracts', () => {
  it.each(componentStyleContracts)('keeps $name legacy public CSS tokens available', async ({
    create,
    legacyTokens,
    name,
  }) => {
    const styleText = await getStyleText(create());

    legacyTokens.forEach((token) => {
      expect(styleText, `${name} should keep ${token}`).toContain(token);
    });
  });

  it.each(componentStyleContracts)('exposes $name DX bridge CSS tokens', async ({
    create,
    dxTokens,
    name,
  }) => {
    const styleText = await getStyleText(create());

    expect(styleText, `${name} should declare local bridge variables`).toContain('--_');
    expect(styleText, `${name} should consume local bridge variables`).toContain('var(--_');

    dxTokens.forEach((token) => {
      expect(styleText, `${name} should expose ${token}`).toContain(token);
    });
  });
});
