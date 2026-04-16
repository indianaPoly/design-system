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
    description: '주요 액션, 보조 액션, 낮은 강조 액션이 한 화면에서 어떻게 위계를 만드는지 확인합니다.',
    render: (container) => {
      const row = document.createElement('div');
      row.className = 'demo-row';

      const primary = document.createElement('ds-button');
      primary.textContent = '계속하기';

      const secondary = document.createElement('ds-button');
      secondary.setAttribute('variant', 'secondary');
      secondary.textContent = '나중에';

      const ghost = document.createElement('ds-button');
      ghost.setAttribute('variant', 'ghost');
      ghost.textContent = '자세히';

      const small = document.createElement('ds-button');
      small.setAttribute('size', 'sm');
      small.textContent = '필터';

      const large = document.createElement('ds-button');
      large.setAttribute('size', 'lg');
      large.textContent = '지금 시작하기';

      row.append(primary, secondary, ghost, small, large);
      container.append(row);
    },
  },
  {
    id: 'card',
    label: 'Card',
    description: '요약 정보와 보조 액션이 차분하게 묶이는 기본 카드 패턴입니다.',
    render: (container) => {
      const card = document.createElement('ds-card');
      card.innerHTML = `
        <div slot="header"><strong>이번 달 요약</strong></div>
        <div>결제 12건, 구독 3건, 알림 2건이 있습니다. 지금 필요한 정보만 빠르게 확인하세요.</div>
        <div slot="footer"><ds-button size="sm" variant="secondary">상세 보기</ds-button></div>
      `;
      container.append(card);
    },
  },
  {
    id: 'input',
    label: 'Input',
    description: '큰 입력 영역과 간결한 피드백으로 빠르게 작성할 수 있는 필드 스타일입니다.',
    render: (container) => {
      const stack = document.createElement('div');
      stack.className = 'demo-stack';

      const input = document.createElement('ds-input');
      input.setAttribute('label', '이메일');
      input.setAttribute('placeholder', 'name@example.com');
      input.setAttribute('helper', '업무용 이메일을 입력하면 초대 링크를 보내드려요.');

      const inputError = document.createElement('ds-input');
      inputError.setAttribute('label', '휴대폰 번호');
      inputError.setAttribute('error', '숫자만 입력해 주세요.');
      inputError.setAttribute('placeholder', '01012345678');

      stack.append(input, inputError);
      container.append(stack);
    },
  },
  {
    id: 'textarea',
    label: 'Textarea',
    description: '긴 문장을 적어도 답답하지 않도록 여백과 줄 간격을 넉넉하게 둔 텍스트 영역입니다.',
    render: (container) => {
      const textarea = document.createElement('ds-textarea');
      textarea.setAttribute('label', '메모');
      textarea.setAttribute('placeholder', '팀에 공유할 메모를 남겨 주세요.');
      textarea.setAttribute('helper', '핵심만 짧고 명확하게 적는 것을 권장합니다.');
      container.append(textarea);
    },
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    description: '선택형 옵션은 명확한 체크 상태와 넉넉한 터치 영역을 우선합니다.',
    render: (container) => {
      const row = document.createElement('div');
      row.className = 'demo-row';

      const checkbox = document.createElement('ds-checkbox');
      checkbox.textContent = '이용약관에 동의합니다';

      const disabled = document.createElement('ds-checkbox');
      disabled.setAttribute('disabled', 'true');
      disabled.textContent = '선택 불가 항목';

      row.append(checkbox, disabled);
      container.append(row);
    },
  },
  {
    id: 'radio',
    label: 'Radio',
    description: '한 번에 하나만 선택해야 하는 결정형 인터페이스에 어울리는 라디오 스타일입니다.',
    render: (container) => {
      const stack = document.createElement('div');
      stack.className = 'demo-stack';

      const optionA = document.createElement('ds-radio');
      optionA.setAttribute('name', 'plan');
      optionA.setAttribute('checked', 'true');
      optionA.textContent = '기본 플랜';

      const optionB = document.createElement('ds-radio');
      optionB.setAttribute('name', 'plan');
      optionB.textContent = '프리미엄 플랜';

      stack.append(optionA, optionB);
      container.append(stack);
    },
  },
  {
    id: 'switch',
    label: 'Switch',
    description: '즉시 켜고 끄는 설정은 상태 변화가 빠르게 읽히도록 대비를 높였습니다.',
    render: (container) => {
      const row = document.createElement('div');
      row.className = 'demo-row';

      const active = document.createElement('ds-switch');
      active.setAttribute('checked', 'true');
      active.textContent = '알림 받기';

      const inactive = document.createElement('ds-switch');
      inactive.textContent = '자동 저장';

      row.append(active, inactive);
      container.append(row);
    },
  },
  {
    id: 'badge',
    label: 'Badge',
    description: '배지는 과한 색 사용 없이도 정보의 상태와 우선순위를 구분하도록 구성했습니다.',
    render: (container) => {
      const stack = document.createElement('div');
      stack.className = 'badge-stack';

      const info = document.createElement('ds-badge');
      info.textContent = '기본';

      const success = document.createElement('ds-badge');
      success.setAttribute('variant', 'success');
      success.textContent = '완료';

      const warning = document.createElement('ds-badge');
      warning.setAttribute('variant', 'warning');
      warning.textContent = '검토 필요';

      const danger = document.createElement('ds-badge');
      danger.setAttribute('variant', 'danger');
      danger.textContent = '중요';

      stack.append(info, success, warning, danger);
      container.append(stack);
    },
  },
  {
    id: 'alert',
    label: 'Alert',
    description: '알림은 색상보다 구조와 밀도로 정보를 먼저 읽을 수 있도록 정리했습니다.',
    render: (container) => {
      const stack = document.createElement('div');
      stack.className = 'demo-stack';

      const info = document.createElement('ds-alert');
      info.setAttribute('title', '업데이트 준비 완료');
      info.textContent = '지금 새 버전으로 전환하면 최신 설정을 바로 사용할 수 있습니다.';

      const success = document.createElement('ds-alert');
      success.setAttribute('variant', 'success');
      success.setAttribute('title', '저장되었습니다');
      success.textContent = '변경한 내용이 안전하게 반영되었습니다.';

      const warning = document.createElement('ds-alert');
      warning.setAttribute('variant', 'warning');
      warning.setAttribute('title', '확인이 필요합니다');
      warning.textContent = '입력한 정보 중 일부가 누락되어 있을 수 있습니다.';

      const danger = document.createElement('ds-alert');
      danger.setAttribute('variant', 'danger');
      danger.setAttribute('title', '요청을 완료하지 못했습니다');
      danger.textContent = '잠시 후 다시 시도하거나 관리자에게 문의해 주세요.';

      stack.append(info, success, warning, danger);
      container.append(stack);
    },
  },
];

const colorGrid = document.querySelector<HTMLDivElement>('#color-grid');
const componentSelect = document.querySelector<HTMLSelectElement>('#component-select');
const componentDescription = document.querySelector<HTMLParagraphElement>('#component-description');
const componentDemo = document.querySelector<HTMLDivElement>('#component-demo');
const themeToggle = document.querySelector<HTMLElement>('#theme-toggle');

if (!colorGrid || !componentSelect || !componentDescription || !componentDemo || !themeToggle) {
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

const applyThemeToggleLabel = () => {
  const isDark = document.documentElement.getAttribute('data-ds-theme') === 'dark';
  themeToggle.textContent = isDark ? 'Light' : 'Dark';
};

const setTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-ds-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-ds-theme');
  }

  localStorage.setItem('ds-theme', theme);
  applyThemeToggleLabel();
};

const savedTheme = localStorage.getItem('ds-theme');
if (savedTheme === 'dark' || savedTheme === 'light') {
  setTheme(savedTheme);
} else {
  applyThemeToggleLabel();
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-ds-theme') === 'dark';
  setTheme(isDark ? 'light' : 'dark');
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
