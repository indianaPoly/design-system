const colorTokens = [
  { name: '--ds-color-primary', label: 'Primary' },
  { name: '--ds-color-accent', label: 'Accent' },
  { name: '--ds-color-text', label: 'Text' },
  { name: '--ds-color-muted', label: 'Muted' },
  { name: '--ds-color-canvas', label: 'Canvas' },
  { name: '--ds-color-surface', label: 'Surface' },
  { name: '--ds-color-surface-raised', label: 'Raised' },
  { name: '--ds-color-border', label: 'Border' },
  { name: '--ds-color-focus', label: 'Focus' },
  { name: '--ds-color-success', label: 'Success' },
  { name: '--ds-color-warning', label: 'Warning' },
  { name: '--ds-color-danger', label: 'Danger' },
];

const renderTokens = () => {
  const colorGrid = document.querySelector('#color-grid');
  if (!colorGrid) return;

  colorTokens.forEach((token) => {
    const card = document.createElement('div');
    card.className = 'token-card';

    const swatch = document.createElement('div');
    swatch.className = 'token-swatch';
    swatch.style.background = `var(${token.name})`;

    const details = document.createElement('div');
    details.className = 'token-details';

    const name = document.createElement('div');
    name.className = 'token-name';
    name.textContent = token.label;

    const value = document.createElement('div');
    value.className = 'token-value';
    value.textContent = token.name;

    details.append(name, value);
    card.append(swatch, details);
    colorGrid.append(card);
  });
};

document.addEventListener('DOMContentLoaded', renderTokens);
