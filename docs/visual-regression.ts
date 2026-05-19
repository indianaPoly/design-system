import '../src/styles/tokens.css';
import '../src/index';

const renderActions = () => {
  const container = document.querySelector<HTMLElement>('#actions-demo');
  if (!container) {
    return;
  }

  const buttonRow = document.createElement('div');
  buttonRow.className = 'visual-row';

  const buttonPrimary = document.createElement('ds-button');
  buttonPrimary.textContent = '계속하기';

  const buttonSecondary = document.createElement('ds-button');
  buttonSecondary.setAttribute('variant', 'secondary');
  buttonSecondary.textContent = '임시 저장';

  const buttonGhost = document.createElement('ds-button');
  buttonGhost.setAttribute('variant', 'ghost');
  buttonGhost.textContent = '자세히';

  const buttonDisabled = document.createElement('ds-button');
  buttonDisabled.setAttribute('variant', 'secondary');
  buttonDisabled.setAttribute('disabled', 'true');
  buttonDisabled.textContent = '비활성';

  buttonRow.append(buttonPrimary, buttonSecondary, buttonGhost, buttonDisabled);

  const badgeRow = document.createElement('div');
  badgeRow.className = 'visual-row';

  const badgeDefault = document.createElement('ds-badge');
  badgeDefault.textContent = '기본';

  const badgePrimary = document.createElement('ds-badge');
  badgePrimary.setAttribute('variant', 'primary');
  badgePrimary.textContent = '핵심';

  const badgeSuccess = document.createElement('ds-badge');
  badgeSuccess.setAttribute('variant', 'success');
  badgeSuccess.textContent = '완료';

  const badgeWarning = document.createElement('ds-badge');
  badgeWarning.setAttribute('variant', 'warning');
  badgeWarning.textContent = '검토 필요';

  badgeRow.append(badgeDefault, badgePrimary, badgeSuccess, badgeWarning);

  container.append(buttonRow, badgeRow);
};

const renderFormFields = () => {
  const container = document.querySelector<HTMLElement>('#form-demo');
  if (!container) {
    return;
  }

  const stack = document.createElement('div');
  stack.className = 'visual-stack visual-field-width';

  const email = document.createElement('ds-input');
  email.setAttribute('label', '이메일');
  email.setAttribute('placeholder', 'name@example.com');
  email.setAttribute('helper', '업무용 이메일을 입력하면 초대 링크를 보냅니다.');
  email.setAttribute('maxlength', '40');
  email.innerHTML = `
    <span slot="prefix">@</span>
    <span slot="suffix">verified</span>
  `;

  const phone = document.createElement('ds-input');
  phone.setAttribute('label', '휴대폰 번호');
  phone.setAttribute('error', '숫자만 입력해 주세요.');
  phone.setAttribute('value', '010-');

  const memo = document.createElement('ds-textarea');
  memo.setAttribute('label', '메모');
  memo.setAttribute('helper', '핵심만 짧게 적는 것을 권장합니다.');
  memo.setAttribute('placeholder', '팀에 공유할 메모를 작성하세요.');
  memo.setAttribute('maxlength', '120');
  memo.innerHTML = '<span slot="footer">자동 저장 중</span>';

  stack.append(email, phone, memo);
  container.append(stack);
};

const renderSelectionControls = () => {
  const container = document.querySelector<HTMLElement>('#selection-demo');
  if (!container) {
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'visual-two-column';

  const left = document.createElement('div');
  left.className = 'visual-stack';

  const checkbox = document.createElement('ds-checkbox');
  checkbox.setAttribute('checked', 'true');
  checkbox.textContent = '이용약관에 동의합니다';

  const checkboxDisabled = document.createElement('ds-checkbox');
  checkboxDisabled.setAttribute('disabled', 'true');
  checkboxDisabled.textContent = '선택 불가 항목';

  left.append(checkbox, checkboxDisabled);

  const right = document.createElement('div');
  right.className = 'visual-stack';

  const radioA = document.createElement('ds-radio');
  radioA.setAttribute('name', 'plan');
  radioA.setAttribute('checked', 'true');
  radioA.textContent = '기본 플랜';

  const radioB = document.createElement('ds-radio');
  radioB.setAttribute('name', 'plan');
  radioB.textContent = '프리미엄 플랜';

  const toggle = document.createElement('ds-switch');
  toggle.setAttribute('checked', 'true');
  toggle.textContent = '알림 받기';

  right.append(radioA, radioB, toggle);
  grid.append(left, right);
  container.append(grid);
};

const renderSurfaces = () => {
  const container = document.querySelector<HTMLElement>('#surfaces-demo');
  if (!container) {
    return;
  }

  const stack = document.createElement('div');
  stack.className = 'visual-stack';

  const card = document.createElement('ds-card');
  card.className = 'visual-card-width';
  card.innerHTML = `
    <div slot="header"><strong>이번 달 요약</strong></div>
    <div>결제 12건, 구독 3건, 알림 2건이 있습니다. 지금 필요한 정보만 빠르게 확인하세요.</div>
    <div slot="footer"><ds-button size="sm" variant="secondary">상세 보기</ds-button></div>
  `;

  const alertInfo = document.createElement('ds-alert');
  alertInfo.setAttribute('title', '업데이트 준비 완료');
  alertInfo.textContent = '지금 새 버전으로 전환하면 최신 설정을 사용할 수 있습니다.';

  const alertDanger = document.createElement('ds-alert');
  alertDanger.setAttribute('variant', 'danger');
  alertDanger.setAttribute('title', '요청을 완료하지 못했습니다');
  alertDanger.textContent = '잠시 후 다시 시도하거나 관리자에게 문의해 주세요.';

  stack.append(card, alertInfo, alertDanger);
  container.append(stack);
};

const renderEdgeCases = () => {
  const container = document.querySelector<HTMLElement>('#edge-cases-demo');
  if (!container) {
    return;
  }

  const stack = document.createElement('div');
  stack.className = 'visual-stack';

  const narrowField = document.createElement('ds-input');
  narrowField.className = 'visual-compact-width';
  narrowField.setAttribute('label', '계정 소유자 표시 이름');
  narrowField.setAttribute('helper', '길이가 긴 라벨과 보조 문구가 함께 들어와도 줄바꿈이 자연스러워야 합니다.');
  narrowField.setAttribute('maxlength', '24');
  narrowField.setAttribute('value', '프로덕트 디자인 시스템');
  narrowField.innerHTML = `
    <span slot="prefix">ID</span>
    <button slot="suffix" type="button">중복 확인</button>
  `;

  const denseTextarea = document.createElement('ds-textarea');
  denseTextarea.className = 'visual-compact-width';
  denseTextarea.setAttribute('label', '팀 공지');
  denseTextarea.setAttribute('helper', '좁은 폭에서도 버튼형 footer와 카운터가 부딪히지 않아야 합니다.');
  denseTextarea.setAttribute('maxlength', '90');
  denseTextarea.setAttribute('value', '디자인 리뷰 후 오후 3시에 배포 여부를 확정합니다.');
  denseTextarea.innerHTML = '<ds-button slot="footer" size="sm" variant="ghost">미리보기</ds-button>';

  stack.append(narrowField, denseTextarea);
  container.append(stack);
};

renderActions();
renderFormFields();
renderSelectionControls();
renderSurfaces();
renderEdgeCases();
