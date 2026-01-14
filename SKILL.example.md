# Design System 사용 가이드 (에이전트용 상세 문서)

이 문서는 에이전트가 디자인 시스템 컴포넌트를 **정확히 사용하고, 필요한 예시를 빠르게 생성**할 수 있도록 정리한 상세 가이드입니다. 예시는 모두 Web Components 기반이며, 프레임워크와 무관하게 사용할 수 있습니다.

---

## 1) 공통 사용 원칙

### 1-1. 컴포넌트 등록
아래처럼 패키지의 엔트리를 불러오면 컴포넌트가 커스텀 엘리먼트로 등록됩니다.

```ts
import '@design-system/core';
```

특정 컴포넌트만 선택적으로 사용할 경우:

```ts
import '@design-system/core/src/components/ds-button';
import '@design-system/core/src/components/ds-input';
```

### 1-2. 토큰 사용
기본 토큰은 `tokens.css`로 제공됩니다. 프로젝트의 전역 스타일에 한 번만 import 하세요.

```css
@import "@design-system/core/styles/tokens.css";
```

필요 시 커스텀 프로퍼티를 재정의하여 테마를 확장할 수 있습니다.

```css
:root {
  --ds-color-primary: #1d4ed8;
  --ds-color-focus: rgba(29, 78, 216, 0.35);
}
```

---

## 2) 컴포넌트별 사용법 (매우 상세)

### 2-1. `ds-button`
**목적:** 기본 클릭 동작, CTA, 보조 액션 제공.

**Props**
- `variant`: `"primary" | "secondary" | "ghost"` (기본값: `primary`)
- `size`: `"sm" | "md" | "lg"` (기본값: `md`)
- `disabled`: `boolean`

**예시**
```html
<ds-button>저장</ds-button>
<ds-button variant="secondary">취소</ds-button>
<ds-button variant="ghost" size="sm">더 보기</ds-button>
<ds-button disabled>로딩 중</ds-button>
```

---

### 2-2. `ds-card`
**목적:** 섹션/카드 레이아웃 구성.

**Props**
- `elevation`: `0 | 1 | 2` (기본값: `1`)

**예시**
```html
<ds-card elevation="2">
  <div slot="header">프로필</div>
  <p>카드 본문 내용</p>
  <div slot="footer">
    <ds-button size="sm">확인</ds-button>
  </div>
</ds-card>
```

---

### 2-3. `ds-input`
**목적:** 단일 행 텍스트 입력.

**Props**
- `label`: 라벨 텍스트
- `helper`: 도움말 텍스트
- `error`: 에러 메시지 (있으면 helper 대신 노출)
- `value`: 입력값 (양방향 바인딩 시 코드에서 갱신)
- `placeholder`: 플레이스홀더
- `name`: 폼 제출용 이름
- `autocomplete`: 자동완성 힌트
- `min`, `max`, `step`: 숫자 입력용 속성
- `type`: `"text" | "email" | "password" | "search" | "tel" | "url" | "number"`
- `disabled`, `required`, `readonly`: boolean

**이벤트**
- `input`: 내부 입력값 변경 시 버블링/컴포즈드 이벤트 발생
- `change`: 포커스 아웃 등 변경 이벤트 발생

**예시**
```html
<ds-input
  label="이메일"
  type="email"
  placeholder="name@example.com"
  helper="계정 복구에 사용됩니다."
></ds-input>
```

**에러 노출**
```html
<ds-input
  label="이메일"
  type="email"
  error="이메일 형식이 올바르지 않습니다."
></ds-input>
```

**JS에서 값 제어**
```ts
const email = document.querySelector('ds-input');
email?.addEventListener('input', (event) => {
  const target = event.currentTarget as HTMLElement & { value: string };
  console.log('현재 값:', target.value);
});
```

---

### 2-4. `ds-textarea`
**목적:** 여러 줄 텍스트 입력.

**Props**
- `label`, `helper`, `error`, `value`, `placeholder`, `name`: `ds-input`과 동일
- `rows`: 기본 줄 수 (기본값: `4`)
- `maxLength`: 최대 글자 수
- `disabled`, `required`, `readonly`: boolean

**예시**
```html
<ds-textarea
  label="메모"
  placeholder="최대 200자"
  maxLength="200"
></ds-textarea>
```

---

### 2-5. `ds-checkbox`
**목적:** 체크박스 선택.

**Props**
- `checked`: boolean
- `disabled`: boolean
- `name`: 폼 제출용 이름
- `value`: 기본값 `on`

**이벤트**
- `change`: 체크 상태가 변경되면 발생

**예시**
```html
<ds-checkbox name="agree" value="yes">약관에 동의합니다</ds-checkbox>
```

---

### 2-6. `ds-radio`
**목적:** 라디오 그룹 선택.

**Props**
- `checked`: boolean
- `disabled`: boolean
- `name`: 그룹명 (같은 그룹은 동일 name)
- `value`: 라디오 값

**예시**
```html
<ds-radio name="plan" value="basic" checked>Basic</ds-radio>
<ds-radio name="plan" value="pro">Pro</ds-radio>
```

---

### 2-7. `ds-switch`
**목적:** on/off 토글.

**Props**
- `checked`: boolean
- `disabled`: boolean
- `name`: 폼 제출용 이름
- `value`: 기본값 `on`

**예시**
```html
<ds-switch name="notifications" checked>알림 켜기</ds-switch>
```

---

### 2-8. `ds-badge`
**목적:** 상태 또는 카테고리 라벨.

**Props**
- `variant`: `"neutral" | "primary" | "success" | "warning" | "danger"`

**예시**
```html
<ds-badge>NEW</ds-badge>
<ds-badge variant="success">활성</ds-badge>
<ds-badge variant="danger">오류</ds-badge>
```

---

### 2-9. `ds-alert`
**목적:** 메시지/상태 알림.

**Props**
- `variant`: `"info" | "success" | "warning" | "danger"`
- `title`: 제목 텍스트 (또는 `slot="title"` 사용 가능)

**예시**
```html
<ds-alert variant="info" title="안내">
  연결이 복구되었습니다.
</ds-alert>
```

**제목 슬롯 사용**
```html
<ds-alert variant="warning">
  <span slot="title">주의</span>
  저장하지 않은 변경사항이 있습니다.
</ds-alert>
```

---

## 3) 조합 예시 (폼)
아래는 입력 컴포넌트를 조합한 간단한 폼 예시입니다.

```html
<ds-card>
  <div slot="header">회원 가입</div>
  <ds-input label="이메일" type="email" placeholder="name@example.com"></ds-input>
  <ds-input label="비밀번호" type="password" placeholder="8자 이상"></ds-input>
  <ds-checkbox>약관에 동의합니다</ds-checkbox>
  <div slot="footer">
    <ds-button>가입하기</ds-button>
  </div>
</ds-card>
```

---

## 4) 에이전트 참고 체크리스트
- 컴포넌트 추가 시 `src/index.ts`에 export를 반드시 추가합니다.
- 시각적 토큰이 필요하면 `src/styles/tokens.css`에 정의합니다.
- 테스트는 `tests/` 디렉터리에 Vitest 기반으로 추가합니다.
- API 변경 또는 컴포넌트 추가 시 사용 예시를 README에 업데이트합니다.
