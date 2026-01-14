import '../src/styles/tokens.css';
import '../src/index';

type TokenDefinition = {
  name: string;
  label: string;
};

type ComponentDefinition = {
  id: string;
  label: string;
  description: string;
  render: (container: HTMLElement) => void;
};

const colorTokens: TokenDefinition[] = [
  { name: '--ds-color-primary', label: 'Primary' },
  { name: '--ds-color-on-primary', label: 'On Primary' },
  { name: '--ds-color-secondary', label: 'Secondary' },
  { name: '--ds-color-on-secondary', label: 'On Secondary' },
  { name: '--ds-color-text', label: 'Text' },
  { name: '--ds-color-muted', label: 'Muted' },
  { name: '--ds-color-surface', label: 'Surface' },
  { name: '--ds-color-surface-muted', label: 'Surface Muted' },
  { name: '--ds-color-border', label: 'Border' },
  { name: '--ds-color-focus', label: 'Focus' },
  { name: '--ds-color-success', label: 'Success' },
  { name: '--ds-color-on-success', label: 'On Success' },
  { name: '--ds-color-warning', label: 'Warning' },
  { name: '--ds-color-on-warning', label: 'On Warning' },
  { name: '--ds-color-danger', label: 'Danger' },
  { name: '--ds-color-on-danger', label: 'On Danger' },
  { name: '--ds-color-input-bg', label: 'Input Background' },
  { name: '--ds-color-input-border', label: 'Input Border' },
  { name: '--ds-color-input-placeholder', label: 'Input Placeholder' },
];

const componentDefinitions: ComponentDefinition[] = [
  {
    id: 'button',
    label: 'Button',
    description: '주요/보조/고스트 버튼과 크기 옵션을 확인합니다.',
    render: (container) => {
      const row = document.createElement('div');
      row.className = 'demo-row';

      const primary = document.createElement('ds-button');
      primary.textContent = 'Primary';

      const secondary = document.createElement('ds-button');
      secondary.setAttribute('variant', 'secondary');
      secondary.textContent = 'Secondary';

      const ghost = document.createElement('ds-button');
      ghost.setAttribute('variant', 'ghost');
      ghost.textContent = 'Ghost';

      const small = document.createElement('ds-button');
      small.setAttribute('size', 'sm');
      small.textContent = 'Small';

      const large = document.createElement('ds-button');
      large.setAttribute('size', 'lg');
      large.textContent = 'Large';

      row.append(primary, secondary, ghost, small, large);
      container.append(row);
    },
  },
  {
    id: 'card',
    label: 'Card',
    description: '헤더/본문/푸터 슬롯 구성을 확인합니다.',
    render: (container) => {
      const card = document.createElement('ds-card');
      card.innerHTML = `
        <div slot="header"><strong>계정 요약</strong></div>
        <div>이번 달 사용 금액과 알림 정보를 확인하세요.</div>
        <div slot="footer"><ds-button size="sm">자세히 보기</ds-button></div>
      `;
      container.append(card);
    },
  },
  {
    id: 'input',
    label: 'Input',
    description: '라벨, 헬퍼, 에러 상태를 함께 확인합니다.',
    render: (container) => {
      const stack = document.createElement('div');
      stack.className = 'demo-stack';

      const input = document.createElement('ds-input');
      input.setAttribute('label', '이메일');
      input.setAttribute('placeholder', 'name@example.com');

      const inputError = document.createElement('ds-input');
      inputError.setAttribute('label', '휴대폰 번호');
      inputError.setAttribute('error', '형식이 올바르지 않습니다.');
      inputError.setAttribute('placeholder', '010-0000-0000');

      stack.append(input, inputError);
      container.append(stack);
    },
  },
  {
    id: 'textarea',
    label: 'Textarea',
    description: '다중 행 입력 필드 예시입니다.',
    render: (container) => {
      const textarea = document.createElement('ds-textarea');
      textarea.setAttribute('label', '메시지');
      textarea.setAttribute('placeholder', '남길 메시지를 입력하세요.');
      textarea.setAttribute('helper', '최대 500자까지 입력 가능합니다.');
      container.append(textarea);
    },
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    description: '기본 체크박스와 비활성 상태를 확인합니다.',
    render: (container) => {
      const row = document.createElement('div');
      row.className = 'demo-row';

      const checkbox = document.createElement('ds-checkbox');
      checkbox.textContent = '이용약관 동의';

      const disabled = document.createElement('ds-checkbox');
      disabled.setAttribute('disabled', 'true');
      disabled.textContent = '비활성화';

      row.append(checkbox, disabled);
      container.append(row);
    },
  },
  {
    id: 'radio',
    label: 'Radio',
    description: '라디오 버튼 그룹 예시입니다.',
    render: (container) => {
      const stack = document.createElement('div');
      stack.className = 'demo-stack';

      const optionA = document.createElement('ds-radio');
      optionA.setAttribute('name', 'plan');
      optionA.setAttribute('checked', 'true');
      optionA.textContent = '기본 요금제';

      const optionB = document.createElement('ds-radio');
      optionB.setAttribute('name', 'plan');
      optionB.textContent = '프리미엄 요금제';

      stack.append(optionA, optionB);
      container.append(stack);
    },
  },
  {
    id: 'switch',
    label: 'Switch',
    description: '토글 스위치 기본 상태를 확인합니다.',
    render: (container) => {
      const row = document.createElement('div');
      row.className = 'demo-row';

      const active = document.createElement('ds-switch');
      active.setAttribute('checked', 'true');
      active.textContent = '자동 갱신';

      const inactive = document.createElement('ds-switch');
      inactive.textContent = '알림 받기';

      row.append(active, inactive);
      container.append(row);
    },
  },
  {
    id: 'badge',
    label: 'Badge',
    description: '상태 배지 variants를 확인합니다.',
    render: (container) => {
      const stack = document.createElement('div');
      stack.className = 'badge-stack';

      const info = document.createElement('ds-badge');
      info.textContent = 'Info';

      const success = document.createElement('ds-badge');
      success.setAttribute('variant', 'success');
      success.textContent = 'Success';

      const warning = document.createElement('ds-badge');
      warning.setAttribute('variant', 'warning');
      warning.textContent = 'Warning';

      const danger = document.createElement('ds-badge');
      danger.setAttribute('variant', 'danger');
      danger.textContent = 'Danger';

      stack.append(info, success, warning, danger);
      container.append(stack);
    },
  },
  {
    id: 'alert',
    label: 'Alert',
    description: '알림 컴포넌트의 4가지 상태를 확인합니다.',
    render: (container) => {
      const stack = document.createElement('div');
      stack.className = 'demo-stack';

      const info = document.createElement('ds-alert');
      info.setAttribute('title', '정보');
      info.textContent = '새 업데이트가 준비되었습니다.';

      const success = document.createElement('ds-alert');
      success.setAttribute('variant', 'success');
      success.setAttribute('title', '완료');
      success.textContent = '결제가 완료되었습니다.';

      const warning = document.createElement('ds-alert');
      warning.setAttribute('variant', 'warning');
      warning.setAttribute('title', '주의');
      warning.textContent = '저장되지 않은 변경 사항이 있습니다.';

      const danger = document.createElement('ds-alert');
      danger.setAttribute('variant', 'danger');
      danger.setAttribute('title', '오류');
      danger.textContent = '요청을 처리할 수 없습니다.';

      stack.append(info, success, warning, danger);
      container.append(stack);
    },
  },
];

const colorGrid = document.querySelector<HTMLDivElement>('#color-grid');
const componentSelect = document.querySelector<HTMLSelectElement>('#component-select');
const componentDescription = document.querySelector<HTMLParagraphElement>('#component-description');
const componentDemo = document.querySelector<HTMLDivElement>('#component-demo');

if (!colorGrid || !componentSelect || !componentDescription || !componentDemo) {
  throw new Error('Preview containers are missing in docs/index.html');
}

const tokenFragment = document.createDocumentFragment();
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
  tokenFragment.append(card);
});
colorGrid.append(tokenFragment);

componentDefinitions.forEach((definition) => {
  const option = document.createElement('option');
  option.value = definition.id;
  option.textContent = definition.label;
  componentSelect.append(option);
});

const renderComponent = (componentId: string) => {
  const definition = componentDefinitions.find((item) => item.id === componentId);
  if (!definition) {
    return;
  }

  componentDescription.textContent = definition.description;
  componentDemo.replaceChildren();
  requestAnimationFrame(() => {
    const fragment = document.createDocumentFragment();
    const container = document.createElement('div');
    container.className = 'demo-stack';
    definition.render(container);
    fragment.append(container);
    componentDemo.append(fragment);
  });
};

componentSelect.addEventListener('change', (event) => {
  const target = event.currentTarget as HTMLSelectElement;
  renderComponent(target.value);
});

renderComponent(componentDefinitions[0].id);
