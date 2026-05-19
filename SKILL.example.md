# Design System 사용 가이드 (소비/사용 중심)

이 문서는 **실제 서비스에서 이 디자인 시스템(`@design-system/core`)을 정확히 사용하는 방법**을 빠르게 익히기 위한 “요리책(cookbook)”입니다.

- 내부 코드 수정(기여) 가이드는 `docs/COMPONENT_EDITING_GUIDE.ko.md`를 참고하세요.

---

## 0) TL;DR (최소 세팅)

### 0-1. 컴포넌트 등록(필수)

```ts
import '@design-system/core';
```

### 0-2. 토큰 CSS 적용(필수)

```css
@import "@design-system/core/styles/tokens.css";
```

---

## 1) Web Components 사용 원칙(중요)

### 1-1. Attribute vs Property

- **HTML에서 초기값 설정**: attribute
  - 예: `<ds-alert variant="warning" title="주의"></ds-alert>`
- **런타임에서 값 제어(권장)**: property
  - 예: `alertEl.variant = 'warning'`, `alertEl.title = '주의'`

### 1-2. reflect의 의미

- `reflect: true`인 prop은 **property 변경이 attribute에도 반영**됩니다.
- 예: `ds-alert`의 `variant`는 reflected 입니다.
- `ds-alert`의 `title`은 reflected가 아닙니다(HTML로 주는 건 가능하지만, property 변경이 attribute로 “되돌아오진” 않습니다).

### 1-3. 이벤트 리스닝

이 저장소의 입력형 컴포넌트(`ds-input`, `ds-textarea`, `ds-checkbox`, `ds-radio`, `ds-switch`)는 내부 native 이벤트를 받아서
**호스트(`ds-*` 엘리먼트)에서 다시 dispatch**합니다.

- 권장 패턴: `element.addEventListener('change', ...)`, `element.addEventListener('input', ...)`
- `Shadow DOM` 밖에서도 잡히도록 `bubbles: true`, `composed: true`로 재전파됩니다.

### 1-4. form submit / reset 연동

입력형 컴포넌트(`ds-input`, `ds-textarea`, `ds-checkbox`, `ds-radio`, `ds-switch`)는 form 제출과 reset을 지원합니다.

- `name`이 있어야 `FormData`에 포함됩니다.
- `disabled` 상태인 값은 제출에서 제외됩니다.
- `ds-checkbox`, `ds-radio`, `ds-switch`는 `checked` 상태일 때만 제출됩니다.
- `form.reset()`을 호출하면 초기 `value` / `checked` 상태로 돌아갑니다.
- 최신 브라우저에서는 Form-Associated Custom Elements를 사용하고, 미지원 환경에서는 hidden input proxy로 보완합니다.

```html
<form id="signup-form">
  <ds-input name="email" label="이메일" type="email" required></ds-input>
  <ds-checkbox name="agree" value="yes" required>약관 동의</ds-checkbox>
  <ds-button>가입</ds-button>
</form>
```

```ts
const form = document.querySelector('#signup-form') as HTMLFormElement | null;
if (!form) throw new Error('form not found');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  console.log(data.get('email'));
  console.log(data.get('agree')); // checked이면 "yes", 아니면 null
});
```

### 1-5. 값 제어의 기준

- 초기 렌더링 값: HTML attribute로 충분합니다.
- 사용자 입력 이후의 제어: DOM property를 기준으로 읽고 씁니다.
- submit payload: `FormData(form)`으로 확인합니다.
- 디버깅: `event.currentTarget`의 `value` / `checked`를 읽습니다.

---

## 2) shadcn/ui처럼 복붙해서 쓰는 흐름

이 패키지는 런타임 컴포넌트를 npm으로 제공하지만, **화면 조각은 docs preview의 Copy blocks를 복붙해서 소유하는 방식**을 권장합니다.

1. 앱 엔트리에서 `@design-system/core`와 token CSS를 1회 import합니다.
2. `bun run docs:dev`로 프리뷰를 열고 `Copy, paste, own` 섹션에서 가까운 블록을 복사합니다.
3. 앱의 화면/라우트 파일에 붙여 넣고 문구, `name`, `value`, submit 로직만 바꿉니다.
4. 필요하면 CSS variable을 페이지/블록 단위로 덮어씁니다.

예:

```html
<section style="display: grid; gap: 14px; max-width: 620px;">
  <ds-alert variant="success" title="시스템 정상">
    모든 API 리전이 정상 동작 중입니다.
  </ds-alert>

  <ds-card>
    <div slot="header" style="display: flex; justify-content: space-between; gap: 12px; align-items: center;">
      <span>이번 달 사용량</span>
      <ds-badge variant="primary">12.8k requests</ds-badge>
    </div>
    <p>무료 한도까지 38% 남았습니다.</p>
    <div slot="footer" style="display: flex; gap: 8px; flex-wrap: wrap;">
      <ds-button size="sm">업그레이드</ds-button>
      <ds-button size="sm" variant="ghost" type="button">사용량 보기</ds-button>
    </div>
  </ds-card>
</section>
```

주의: form 안에서 제출용이 아닌 버튼은 반드시 `type="button"`을 지정하세요.

---

## 3) 테마/플랫폼 전환 (Dark / iOS)

테마와 플랫폼은 **루트 요소(`<html>` 권장)**에 attribute를 붙여 제어합니다.

- Dark: `data-ds-theme="dark"`
- iOS: `data-ds-platform="ios"`

### 3-1. HTML에서 고정

```html
<html data-ds-theme="dark" data-ds-platform="ios">
```

### 3-2. JS로 토글

```ts
const root = document.documentElement;

const setTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') root.setAttribute('data-ds-theme', 'dark');
  else root.removeAttribute('data-ds-theme');
};

const setPlatform = (platform: 'default' | 'ios') => {
  if (platform === 'ios') root.setAttribute('data-ds-platform', 'ios');
  else root.removeAttribute('data-ds-platform');
};
```

---

## 4) 스타일 커스터마이징(토큰 + part)

### 4-1. 전역 토큰으로 테마 커스터마이징

```css
:root {
  /* 예: primary 톤만 변경 */
  --ds-color-primary: #f97316;
}

:root[data-ds-theme="dark"] {
  --ds-color-primary: #fb923c;
}
```

### 4-2. 컴포넌트 토큰으로 특정 컴포넌트만 조정

예: `ds-alert`

```css
:root {
  --ds-alert-radius: 16px;
  --ds-alert-padding-x: 18px;
  --ds-alert-padding-y: 14px;
}
```

### 4-3. 단일 인스턴스만 바꾸기

```html
<ds-alert
  title="안내"
  style="--ds-alert-radius: 20px; --ds-alert-info-bg: rgba(249, 115, 22, 0.12);"
>
  인스턴스 단위로 토큰 오버라이드도 가능합니다.
</ds-alert>
```

### 4-4. `::part(...)`로 내부 스타일 후킹

`ds-alert`는 `part="alert" | "title" | "body"`를 제공합니다.

```css
/* title만 타이포를 바꾸고 싶을 때 */
ds-alert::part(title) {
  letter-spacing: -0.01em;
}

/* wrapper(section)에만 스타일 적용 */
ds-alert::part(alert) {
  border-width: 2px;
}
```

---

## 5) 컴포넌트별 사용법

### 5-1. `ds-button`

**Props**
- `variant`: `"primary" | "secondary" | "ghost"` (기본값: `primary`)
- `size`: `"sm" | "md" | "lg"` (기본값: `md`)
- `type`: `"button" | "submit" | "reset"` (기본값: `submit`)
- `disabled`: `boolean`

```html
<ds-button>저장</ds-button>
<ds-button variant="secondary">취소</ds-button>
<ds-button variant="ghost" size="sm">더 보기</ds-button>
<ds-button type="button" variant="ghost">폼 제출 없이 닫기</ds-button>
<ds-button disabled>로딩 중</ds-button>
```

---

### 5-2. `ds-card`

**Props**
- `elevation`: `0 | 1 | 2` (기본값: `1`)

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

### 5-3. `ds-input`

**Props**
- `label`, `helper`, `error`, `value`, `placeholder`, `name`, `autocomplete`, `min`, `max`, `step`
- `maxLength`: 최대 글자 수
- `type`: `"text" | "email" | "password" | "search" | "tel" | "url" | "number"`
- `disabled`, `required`, `readonly`: boolean

**Slots**
- `slot="prefix"`: 입력 앞 장식
- `slot="suffix"`: 입력 뒤 장식/액션

**이벤트**
- `input`: 값 입력 시
- `change`: 포커스 아웃 등 변경 확정 시

```html
<ds-input
  label="이메일"
  type="email"
  placeholder="name@example.com"
  helper="계정 복구에 사용됩니다."
></ds-input>
```

```html
<ds-input label="아이디" maxLength="20">
  <span slot="prefix">@</span>
  <span slot="suffix">20자 이내</span>
</ds-input>
```

**JS에서 값 제어 + 이벤트 리스닝**

```ts
const email = document.querySelector('ds-input');
if (!email) throw new Error('ds-input not found');

email.addEventListener('input', (event) => {
  const target = event.currentTarget as HTMLElement & { value: string };
  console.log('현재 값:', target.value);
});

// 런타임 값 주입
(email as HTMLElement & { value: string }).value = 'hello@example.com';
```

---

### 5-4. `ds-textarea`

**Props**
- `label`, `helper`, `error`, `value`, `placeholder`, `name`
- `rows`: 기본 줄 수 (기본값: `4`)
- `maxLength`: 최대 글자 수
- `disabled`, `required`, `readonly`: boolean

```html
<ds-textarea
  label="메모"
  placeholder="최대 200자"
  maxLength="200"
></ds-textarea>
```

---

### 5-5. `ds-checkbox`

**Props**
- `checked`: boolean
- `disabled`: boolean
- `name`: string
- `value`: 기본값 `on`

**이벤트**
- `change`: 체크 상태 변경

```html
<ds-checkbox name="agree" value="yes">약관에 동의합니다</ds-checkbox>
```

---

### 5-6. `ds-radio`

**Props**
- `checked`: boolean
- `disabled`: boolean
- `name`: 그룹명(동일 name)
- `value`: 라디오 값

```html
<ds-radio name="plan" value="basic" checked>Basic</ds-radio>
<ds-radio name="plan" value="pro">Pro</ds-radio>
```

---

### 5-7. `ds-switch`

**Props**
- `checked`: boolean
- `disabled`: boolean
- `name`: string
- `value`: 기본값 `on`

**이벤트**
- `change`: 토글 변경

```html
<ds-switch name="notifications" checked>알림 켜기</ds-switch>
```

---

### 5-8. `ds-badge`

**Props**
- `variant`: `"neutral" | "primary" | "success" | "warning" | "danger"`

```html
<ds-badge>NEW</ds-badge>
<ds-badge variant="success">활성</ds-badge>
<ds-badge variant="danger">오류</ds-badge>
```

---

### 5-9. `ds-alert`

파일 구현 참고: `src/components/ds-alert.ts`

**Props**
- `variant`: `"info" | "success" | "warning" | "danger"`
- `title`: 제목 텍스트

**Slots**
- `slot="title"`: 제목 슬롯(우선)
- default slot: 본문

**Parts**
- `alert`, `title`, `body`

```html
<ds-alert variant="info" title="안내">
  연결이 복구되었습니다.
</ds-alert>

<ds-alert variant="warning">
  <span slot="title">주의</span>
  저장하지 않은 변경사항이 있습니다.
</ds-alert>
```

**JS에서 prop로 제어**

```ts
const alert = document.createElement('ds-alert') as HTMLElement & {
  variant: 'info' | 'success' | 'warning' | 'danger';
  title: string;
};

alert.variant = 'danger';
alert.title = '오류';
alert.textContent = '요청을 처리할 수 없습니다.';

document.body.append(alert);
```

---

## 6) React에서 사용하기 (실전 패턴)

React에서 Custom Element를 안정적으로 쓰려면 보통 아래 2가지를 같이 챙깁니다.

1) 런타임 등록(사이드 이펙트 import)
2) (TypeScript 사용 시) TSX에서 `ds-*` 태그 타입 선언

또한 Custom Element 이벤트는 프레임워크의 synthetic event로 잘 연결되지 않는 경우가 있어,
가장 안전한 패턴은 **ref + addEventListener** 입니다.

### 6-1. 앱 엔트리에서 1회 등록

```ts
// main.tsx / index.tsx
import '@design-system/core';
import '@design-system/core/styles/tokens.css';
```

### 6-2. (TypeScript) TSX에서 `ds-*` 태그 타입 선언

프로젝트에 아래 같은 `*.d.ts` 파일을 추가하면 TSX에서 `ds-*` 태그를 에러 없이 사용할 수 있습니다.

예: `src/types/design-system.d.ts`

```ts
import type * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ds-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        type?: string;
        placeholder?: string;
      };

      'ds-alert': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: 'info' | 'success' | 'warning' | 'danger';
        title?: string;
      };
    }
  }
}

export {};
```

- 위 선언은 “최소 예시”입니다. 실제로는 프로젝트에서 쓰는 태그/속성만 점진적으로 늘리는 걸 권장합니다.

### 6-3. ds-input 예시 (value + input 이벤트)

```tsx
import { useEffect, useRef } from 'react';

export function EmailField() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current as (HTMLElement & { value: string }) | null;
    if (!el) return;

    const onInput = (event: Event) => {
      const target = event.currentTarget as HTMLElement & { value: string };
      console.log('value:', target.value);
    };

    el.addEventListener('input', onInput);
    return () => el.removeEventListener('input', onInput);
  }, []);

  return <ds-input ref={ref} label="이메일" type="email" />;
}
```

### 6-4. ds-alert 예시 (props 제어)

```tsx
import { useEffect, useRef } from 'react';

export function NetworkAlert({ isError }: { isError: boolean }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current as (HTMLElement & {
      variant: 'info' | 'success' | 'warning' | 'danger';
      title: string;
    }) | null;

    if (!el) return;

    el.variant = isError ? 'danger' : 'success';
    el.title = isError ? '오류' : '정상';
  }, [isError]);

  return <ds-alert ref={ref}>네트워크 상태를 확인하세요.</ds-alert>;
}
```

---

## 7) Vue에서 사용하기 (실전 패턴)

Vue는 기본적으로 Custom Element를 잘 다루지만, 프로젝트 설정에 따라
컴파일러가 `ds-*` 태그를 unknown으로 경고할 수 있습니다.

### 7-1. (선택) Vue 컴파일러 설정

`vite.config.ts` 등에서:

```ts
// 예시: Vue plugin 설정에서
// compilerOptions.isCustomElement = (tag) => tag.startsWith('ds-')
```

### 7-2. ds-switch 예시

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const elRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const el = elRef.value as (HTMLElement & { checked: boolean }) | null;
  if (!el) return;

  el.addEventListener('change', () => {
    console.log('checked:', el.checked);
  });
});
</script>

<template>
  <ds-switch ref="elRef" checked>알림 켜기</ds-switch>
</template>
```

---

## 8) Worst case / 잘못된 사용 케이스

아래 케이스들은 “일단 화면에 보이지만, 실제 서비스에서 깨지기 쉬운” 패턴입니다.

### 8-1. 컴포넌트 등록 import를 화면마다 중복/누락

**Bad**

```ts
// 어떤 페이지에는 있고, 어떤 페이지에는 없음
import '@design-system/core';
```

**Why bad**
- 등록 import가 누락된 화면에서는 `<ds-*>`가 unknown element처럼 동작합니다.
- 라우트 단위 lazy loading에서 특정 화면만 깨질 수 있습니다.

**Good**

```ts
// 앱 엔트리에서 1회
import '@design-system/core';
import '@design-system/core/styles/tokens.css';
```

### 8-2. `name` 없이 form submit이 되길 기대

**Bad**

```html
<form id="form">
  <ds-input label="이메일" value="hello@example.com"></ds-input>
  <ds-checkbox checked>동의</ds-checkbox>
</form>
```

```ts
const data = new FormData(document.querySelector('#form') as HTMLFormElement);
console.log(data.get('email')); // null
```

**Good**

```html
<form id="form">
  <ds-input name="email" label="이메일" value="hello@example.com"></ds-input>
  <ds-checkbox name="agree" value="yes" checked>동의</ds-checkbox>
</form>
```

### 8-3. checkbox/radio/switch의 unchecked 값을 제출된다고 가정

**Bad**

```html
<ds-checkbox name="marketing" value="yes">마케팅 수신</ds-checkbox>
```

```ts
const data = new FormData(form);
Boolean(data.get('marketing')); // unchecked면 false가 아니라 null
```

**Good**

```ts
const marketing = data.get('marketing') === 'yes';
```

### 8-4. React에서 `onChange`만 믿기

**Bad**

```tsx
export function BadField() {
  return (
    <ds-input
      label="이메일"
      onChange={(event) => {
        console.log(event);
      }}
    />
  );
}
```

**Why bad**
- Custom Element 이벤트는 React synthetic event와 기대대로 연결되지 않을 수 있습니다.
- 특히 `input`, `change` 이벤트는 `ref + addEventListener`가 가장 안전합니다.

**Good**

```tsx
import { useEffect, useRef } from 'react';

export function GoodField() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current as (HTMLElement & { value: string }) | null;
    if (!el) return;

    const onInput = () => {
      console.log(el.value);
    };

    el.addEventListener('input', onInput);
    return () => el.removeEventListener('input', onInput);
  }, []);

  return <ds-input ref={ref} label="이메일" />;
}
```

### 8-5. `event.target`을 내부 native input이라고 가정

**Bad**

```ts
input.addEventListener('input', (event) => {
  const target = event.target as HTMLInputElement;
  console.log(target.value);
});
```

**Why bad**
- Shadow DOM 이벤트 재전파 과정에서 `target`은 기대와 다를 수 있습니다.

**Good**

```ts
input.addEventListener('input', (event) => {
  const target = event.currentTarget as HTMLElement & { value: string };
  console.log(target.value);
});
```

### 8-6. boolean attribute에 `"false"` 문자열 넣기

**Bad**

```html
<!-- HTML boolean attribute는 값 문자열이 아니라 "존재 여부"가 true입니다. -->
<ds-checkbox checked="false">동의하지 않음</ds-checkbox>
```

**Good**

```html
<!-- false가 기본값이면 attribute를 생략합니다. -->
<ds-checkbox>동의하지 않음</ds-checkbox>
```

```ts
const checkbox = document.querySelector('ds-checkbox') as (HTMLElement & { checked: boolean }) | null;
if (checkbox) checkbox.checked = false;
```

또한 사용자 입력 이후 최신 값은 attribute가 아니라 property에서 읽는 것을 기준으로 삼습니다.

```ts
const value = input.value; // Good
// const value = input.getAttribute('value'); // Bad: 사용자 입력 후 최신 값과 다를 수 있음
```

### 8-7. CSS class로 Shadow DOM 내부를 직접 찌르기

**Bad**

```css
ds-alert .title {
  font-weight: 900;
}
```

**Good**

```css
ds-alert::part(title) {
  font-weight: 900;
}
```

### 8-8. 테마 attribute를 컴포넌트마다 붙이기

**Bad**

```html
<ds-card data-ds-theme="dark">...</ds-card>
<ds-alert data-ds-theme="dark">...</ds-alert>
```

**Good**

```html
<html data-ds-theme="dark">
```

### 8-9. reset 직전의 동적 값을 “새 기본값”으로 기대

**Bad**

```ts
input.value = 'changed@example.com';
form.reset(); // changed@example.com이 아니라 초기값으로 복귀
```

**Good**

```ts
// reset은 초기 렌더링/연결 시점의 기본값으로 돌리는 기능으로 사용합니다.
// 서버에서 새 초기값을 받은 경우에는 reset 대신 property를 명시적으로 다시 세팅합니다.
input.value = 'server-default@example.com';
```

### 8-10. visual regression baseline을 운영 스크린샷처럼 수정

**Bad**

```bash
# 의도 확인 없이 baseline을 업데이트
bun run test:visual -- --update-snapshots
```

**Good**

```bash
bun run test:visual
# 실패 diff를 확인한 뒤, 의도한 UI 변경일 때만 baseline 갱신
```

---

## 9) 실사용 전 최종 체크리스트

- 앱 엔트리에서 `@design-system/core`와 tokens CSS를 각각 1회 import했는가?
- form 제출이 필요한 컴포넌트에 `name`을 부여했는가?
- `checked` 계열 값은 unchecked일 때 `FormData`에 없다는 점을 처리했는가?
- React에서는 `ref + addEventListener`로 이벤트를 연결했는가?
- 런타임 값 변경은 attribute가 아니라 property로 처리했는가?
- 테마는 루트 요소의 `data-ds-theme` / `data-ds-platform`으로 제어했는가?
- 내부 스타일 커스터마이징은 CSS variable 또는 `::part(...)`만 사용했는가?
- UI 변경 후 `bun run test`, `bun run docs:build`, 필요 시 `bun run test:visual`을 돌렸는가?

---

## 10) 디버깅 체크리스트

- 컴포넌트가 안 보인다
  - `import '@design-system/core'`가 실행되었는지 확인
  - 번들러가 ESM side-effect import를 제거하지 않는지 확인(패키지 `sideEffects: true`)
- 스타일이 이상하다
  - `@import "@design-system/core/styles/tokens.css";`가 전역에 1회 적용됐는지 확인
  - 특정 화면에서만 다르면, CSS 스코프/우선순위 문제인지 확인
- 이벤트가 안 잡힌다
  - `onChange` 같은 프레임워크 전용 핸들러 대신 `addEventListener`로 우회
  - `event.target` 대신 `event.currentTarget` 사용
- form 값이 제출되지 않는다
  - `name`이 있는지 확인
  - `disabled`가 아닌지 확인
  - checkbox/radio/switch가 `checked` 상태인지 확인
