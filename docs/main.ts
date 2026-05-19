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

type CopyBlock = {
  id: string;
  title: string;
  description: string;
  code: string;
};

const colorTokens: TokenDefinition[] = [
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

const setHTML = (container: HTMLElement, html: string) => {
  container.innerHTML = html;
};

const componentDefinitions: ComponentDefinition[] = [
  {
    id: 'button',
    label: 'Button',
    description: '작은 SaaS 화면에서 바로 쓸 수 있는 액션 위계입니다. Primary는 한 화면에 하나만 두는 것을 권장합니다.',
    render: (container) => setHTML(container, `
      <div class="demo-row">
        <ds-button>배포하기</ds-button>
        <ds-button variant="secondary">미리보기</ds-button>
        <ds-button variant="ghost">취소</ds-button>
        <ds-button size="sm" variant="secondary">필터</ds-button>
        <ds-button size="lg">프로젝트 생성</ds-button>
      </div>
    `),
  },
  {
    id: 'card',
    label: 'Card',
    description: '헤더/본문/푸터가 있는 앱 카드입니다. 불필요한 장식보다 정보 밀도와 경계가 먼저 읽히게 했습니다.',
    render: (container) => setHTML(container, `
      <ds-card class="demo-card">
        <div slot="header" style="display: flex; justify-content: space-between; gap: 12px; align-items: center;">
          <span>월간 사용량</span>
          <ds-badge variant="primary">Live</ds-badge>
        </div>
        <div class="metric-grid">
          <div><strong>12.8k</strong><span>요청</span></div>
          <div><strong>99.9%</strong><span>성공률</span></div>
          <div><strong>42ms</strong><span>응답</span></div>
        </div>
        <div slot="footer" class="demo-row compact">
          <ds-button size="sm">리포트 보기</ds-button>
          <ds-button size="sm" variant="ghost">CSV</ds-button>
        </div>
      </ds-card>
    `),
  },
  {
    id: 'input',
    label: 'Input',
    description: '라벨, helper, error, prefix/suffix, counter가 한 컴포넌트 안에서 안정적으로 정렬됩니다.',
    render: (container) => setHTML(container, `
      <div class="demo-stack narrow">
        <ds-input label="워크스페이스 URL" value="acme" helper="팀원이 접속할 고유 주소입니다." maxLength="24">
          <span slot="prefix">https://</span>
          <span slot="suffix">.app</span>
        </ds-input>
        <ds-input label="결제 이메일" type="email" error="유효한 이메일 주소를 입력해 주세요." value="billing@">
        </ds-input>
      </div>
    `),
  },
  {
    id: 'textarea',
    label: 'Textarea',
    description: '긴 설명을 적는 상태에서도 카운터와 footer 액션이 부딪히지 않는 작성 패턴입니다.',
    render: (container) => setHTML(container, `
      <div class="demo-stack narrow">
        <ds-textarea label="릴리즈 노트" helper="고객에게 보일 한두 문장으로 정리하세요." value="대시보드의 로딩 속도와 알림 안정성을 개선했습니다." maxLength="140">
          <ds-button slot="footer" size="sm" variant="ghost">미리보기</ds-button>
        </ds-textarea>
      </div>
    `),
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    description: '설정/약관처럼 다중 선택이 가능한 항목에 맞춘 터치-safe 컨트롤입니다.',
    render: (container) => setHTML(container, `
      <div class="choice-panel">
        <ds-checkbox checked name="reports" value="weekly">주간 리포트 받기</ds-checkbox>
        <ds-checkbox name="marketing" value="yes">제품 업데이트 메일 받기</ds-checkbox>
        <ds-checkbox disabled>관리자 전용 설정</ds-checkbox>
      </div>
    `),
  },
  {
    id: 'radio',
    label: 'Radio',
    description: '하나의 결정을 빠르게 비교할 수 있도록 라디오 그룹을 카드형 레이아웃에 배치할 수 있습니다.',
    render: (container) => setHTML(container, `
      <div class="choice-panel two-column">
        <ds-radio name="plan" value="starter" checked>Starter · 개인/소규모 팀</ds-radio>
        <ds-radio name="plan" value="pro">Pro · 성장 중인 팀</ds-radio>
      </div>
    `),
  },
  {
    id: 'switch',
    label: 'Switch',
    description: '즉시 반영되는 설정에는 switch를 사용합니다. 상태가 색과 thumb 위치로 동시에 읽힙니다.',
    render: (container) => setHTML(container, `
      <div class="choice-panel">
        <ds-switch name="alerts" value="enabled" checked>장애 알림 즉시 받기</ds-switch>
        <ds-switch name="autosave" value="enabled">초안 자동 저장</ds-switch>
      </div>
    `),
  },
  {
    id: 'badge',
    label: 'Badge',
    description: '상태 색은 작게, 의미는 명확하게. 리스트/카드 안에서 과한 면적을 차지하지 않습니다.',
    render: (container) => setHTML(container, `
      <div class="badge-stack">
        <ds-badge>Draft</ds-badge>
        <ds-badge variant="primary">Beta</ds-badge>
        <ds-badge variant="success">Healthy</ds-badge>
        <ds-badge variant="warning">Review</ds-badge>
        <ds-badge variant="danger">Blocked</ds-badge>
      </div>
    `),
  },
  {
    id: 'alert',
    label: 'Alert',
    description: '상태 메시지는 배경, border, indicator가 함께 작동해서 빠르게 구분됩니다.',
    render: (container) => setHTML(container, `
      <div class="demo-stack">
        <ds-alert title="배포 준비 완료">모든 검증이 통과했습니다. 지금 프로덕션에 배포할 수 있습니다.</ds-alert>
        <ds-alert variant="success" title="저장되었습니다">변경한 설정이 팀 워크스페이스에 반영되었습니다.</ds-alert>
        <ds-alert variant="warning" title="확인이 필요합니다">청구 정보가 만료되기 전에 결제 수단을 업데이트하세요.</ds-alert>
        <ds-alert variant="danger" title="요청 실패">잠시 후 다시 시도하거나 관리자에게 문의해 주세요.</ds-alert>
      </div>
    `),
  },
];

const copyBlocks: CopyBlock[] = [
  {
    id: 'signup-panel',
    title: 'Signup form card',
    description: '랜딩/초대 플로우에서 바로 붙여 넣는 가입 카드입니다.',
    code: `<section style="max-width: 460px;">
  <ds-card>
    <div slot="header" style="display: grid; gap: 8px;">
      <ds-badge variant="primary">Private beta</ds-badge>
      <h2 style="margin: 0;">팀 워크스페이스 만들기</h2>
      <p style="margin: 0; color: var(--ds-color-muted);">이메일과 워크스페이스 URL만 입력하면 바로 시작할 수 있습니다.</p>
    </div>

    <form id="signup-form" style="display: grid; gap: 14px;">
      <ds-input name="email" label="업무용 이메일" type="email" placeholder="name@company.com" required></ds-input>
      <ds-input name="workspace" label="워크스페이스 URL" value="acme" maxLength="24" required>
        <span slot="prefix">https://</span>
        <span slot="suffix">.app</span>
      </ds-input>
      <ds-checkbox name="agree" value="yes" required>약관과 개인정보 처리방침에 동의합니다</ds-checkbox>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <ds-button>시작하기</ds-button>
        <ds-button type="button" variant="ghost">데모 보기</ds-button>
      </div>
    </form>
  </ds-card>
</section>`,
  },
  {
    id: 'settings-panel',
    title: 'Settings panel',
    description: '제품 설정/알림/권한 화면에 적합한 카드형 설정 블록입니다.',
    code: `<ds-card style="max-width: 560px;">
  <div slot="header" style="display: flex; justify-content: space-between; gap: 16px; align-items: start;">
    <div>
      <h2 style="margin: 0;">알림 설정</h2>
      <p style="margin: 6px 0 0; color: var(--ds-color-muted);">팀에 필요한 이벤트만 선별해서 받아보세요.</p>
    </div>
    <ds-badge variant="success">Active</ds-badge>
  </div>

  <div style="display: grid; gap: 10px;">
    <ds-switch name="incident" value="enabled" checked>장애 알림 즉시 받기</ds-switch>
    <ds-switch name="weekly" value="enabled">주간 요약 리포트 받기</ds-switch>
    <ds-checkbox name="mentions" value="yes" checked>내가 멘션된 이벤트만 강조</ds-checkbox>
  </div>

  <div slot="footer" style="display: flex; gap: 8px; flex-wrap: wrap;">
    <ds-button size="sm">저장</ds-button>
    <ds-button size="sm" variant="secondary" type="button">초기화</ds-button>
  </div>
</ds-card>`,
  },
  {
    id: 'status-stack',
    title: 'Status surface stack',
    description: '대시보드 상단에서 상태와 다음 액션을 한 번에 보여주는 블록입니다.',
    code: `<section style="display: grid; gap: 14px; max-width: 620px;">
  <ds-alert variant="success" title="시스템 정상">
    모든 API 리전이 정상 동작 중입니다. 평균 응답 시간은 42ms입니다.
  </ds-alert>

  <ds-card>
    <div slot="header" style="display: flex; justify-content: space-between; gap: 12px; align-items: center;">
      <span>이번 달 사용량</span>
      <ds-badge variant="primary">12.8k requests</ds-badge>
    </div>
    <p>무료 한도까지 38% 남았습니다. 사용량이 빠르게 증가하면 Pro 플랜을 추천합니다.</p>
    <div slot="footer" style="display: flex; gap: 8px; flex-wrap: wrap;">
      <ds-button size="sm">업그레이드</ds-button>
      <ds-button size="sm" variant="ghost" type="button">사용량 보기</ds-button>
    </div>
  </ds-card>
</section>`,
  },
];

const colorGrid = document.querySelector<HTMLDivElement>('#color-grid');
const componentGrid = document.querySelector<HTMLDivElement>('#component-grid');
const componentDescription = document.querySelector<HTMLParagraphElement>('#component-description');
const componentDemo = document.querySelector<HTMLDivElement>('#component-demo');
const blockGrid = document.querySelector<HTMLDivElement>('#block-grid');
const themeToggle = document.querySelector<HTMLElement>('#theme-toggle');

if (!colorGrid || !componentGrid || !componentDescription || !componentDemo || !blockGrid || !themeToggle) {
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

const renderComponent = (componentId: string) => {
  const definition = componentDefinitions.find((item) => item.id === componentId);
  if (!definition) return;

  componentGrid.querySelectorAll('button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.componentId === componentId));
  });

  componentDescription.textContent = definition.description;
  componentDemo.replaceChildren();
  const container = document.createElement('div');
  container.className = 'demo-stack';
  definition.render(container);
  componentDemo.append(container);
};

const componentFragment = document.createDocumentFragment();
componentDefinitions.forEach((definition, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'component-chip';
  button.dataset.componentId = definition.id;
  button.setAttribute('aria-pressed', String(index === 0));
  button.textContent = definition.label;
  button.addEventListener('click', () => renderComponent(definition.id));
  componentFragment.append(button);
});
componentGrid.append(componentFragment);

const copyToClipboard = async (text: string, trigger: HTMLButtonElement) => {
  try {
    await navigator.clipboard.writeText(text);
    trigger.textContent = 'Copied';
    window.setTimeout(() => {
      trigger.textContent = 'Copy';
    }, 1200);
  } catch {
    trigger.textContent = 'Select code';
  }
};

const blockFragment = document.createDocumentFragment();
copyBlocks.forEach((block) => {
  const article = document.createElement('article');
  article.className = 'block-card';

  const header = document.createElement('div');
  header.className = 'block-header';

  const titleWrap = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = block.title;
  const description = document.createElement('p');
  description.textContent = block.description;
  titleWrap.append(title, description);

  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy-button';
  copy.textContent = 'Copy';
  copy.addEventListener('click', () => copyToClipboard(block.code, copy));

  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.textContent = block.code;
  pre.append(code);

  header.append(titleWrap, copy);
  article.append(header, pre);
  blockFragment.append(article);
});
blockGrid.append(blockFragment);

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

renderComponent(componentDefinitions[0].id);
