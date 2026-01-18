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

### 1-4. (주의) form submit은 자동이 아닙니다

Shadow DOM 내부의 `<input name="...">`는 기본 HTML form submit에 자동으로 포함되지 않습니다.

- 폼 제출이 필요하면 앱에서 값들을 수집해서 제출 로직을 구성하세요.
- 장기적으로는 **Form-Associated Custom Elements**로 확장하는 접근이 필요합니다(현재 구현은 해당 기능을 사용하지 않습니다).

---

## 2) 테마/플랫폼 전환 (Dark / iOS)

테마와 플랫폼은 **루트 요소(`<html>` 권장)**에 attribute를 붙여 제어합니다.

- Dark: `data-ds-theme="dark"`
- iOS: `data-ds-platform="ios"`

### 2-1. HTML에서 고정

```html
<html data-ds-theme="dark" data-ds-platform="ios">
```

### 2-2. JS로 토글

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

## 3) 스타일 커스터마이징(토큰 + part)

### 3-1. 전역 토큰으로 테마 커스터마이징

```css
:root {
  /* 예: primary 톤만 변경 */
  --ds-color-primary: #f97316;
}

:root[data-ds-theme="dark"] {
  --ds-color-primary: #fb923c;
}
```

### 3-2. 컴포넌트 토큰으로 특정 컴포넌트만 조정

예: `ds-alert`

```css
:root {
  --ds-alert-radius: 16px;
  --ds-alert-padding-x: 18px;
  --ds-alert-padding-y: 14px;
}
```

### 3-3. 단일 인스턴스만 바꾸기

```html
<ds-alert
  title="안내"
  style="--ds-alert-radius: 20px; --ds-alert-info-bg: rgba(249, 115, 22, 0.12);"
>
  인스턴스 단위로 토큰 오버라이드도 가능합니다.
</ds-alert>
```

### 3-4. `::part(...)`로 내부 스타일 후킹

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

## 4) 컴포넌트별 사용법

### 4-1. `ds-button`

**Props**
- `variant`: `"primary" | "secondary" | "ghost"` (기본값: `primary`)
- `size`: `"sm" | "md" | "lg"` (기본값: `md`)
- `disabled`: `boolean`

```html
<ds-button>저장</ds-button>
<ds-button variant="secondary">취소</ds-button>
<ds-button variant="ghost" size="sm">더 보기</ds-button>
<ds-button disabled>로딩 중</ds-button>
```

---

### 4-2. `ds-card`

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

### 4-3. `ds-input`

**Props**
- `label`, `helper`, `error`, `value`, `placeholder`, `name`, `autocomplete`, `min`, `max`, `step`
- `type`: `"text" | "email" | "password" | "search" | "tel" | "url" | "number"`
- `disabled`, `required`, `readonly`: boolean

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

### 4-4. `ds-textarea`

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

### 4-5. `ds-checkbox`

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

### 4-6. `ds-radio`

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

### 4-7. `ds-switch`

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

### 4-8. `ds-badge`

**Props**
- `variant`: `"neutral" | "primary" | "success" | "warning" | "danger"`

```html
<ds-badge>NEW</ds-badge>
<ds-badge variant="success">활성</ds-badge>
<ds-badge variant="danger">오류</ds-badge>
```

---

### 4-9. `ds-alert`

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

## 5) React에서 사용하기 (실전 패턴)

React에서 Custom Element를 안정적으로 쓰려면 보통 아래 2가지를 같이 챙깁니다.

1) 런타임 등록(사이드 이펙트 import)
2) (TypeScript 사용 시) TSX에서 `ds-*` 태그 타입 선언

또한 Custom Element 이벤트는 프레임워크의 synthetic event로 잘 연결되지 않는 경우가 있어,
가장 안전한 패턴은 **ref + addEventListener** 입니다.

### 5-1. 앱 엔트리에서 1회 등록

```ts
// main.tsx / index.tsx
import '@design-system/core';
import '@design-system/core/styles/tokens.css';
```

### 5-2. (TypeScript) TSX에서 `ds-*` 태그 타입 선언

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

### 5-3. ds-input 예시 (value + input 이벤트)

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

### 5-4. ds-alert 예시 (props 제어)

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

## 6) Vue에서 사용하기 (실전 패턴)

Vue는 기본적으로 Custom Element를 잘 다루지만, 프로젝트 설정에 따라
컴파일러가 `ds-*` 태그를 unknown으로 경고할 수 있습니다.

### 6-1. (선택) Vue 컴파일러 설정

`vite.config.ts` 등에서:

```ts
// 예시: Vue plugin 설정에서
// compilerOptions.isCustomElement = (tag) => tag.startsWith('ds-')
```

### 6-2. ds-switch 예시

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

## 7) 디버깅 체크리스트

- 컴포넌트가 안 보인다
  - `import '@design-system/core'`가 실행되었는지 확인
  - 번들러가 ESM side-effect import를 제거하지 않는지 확인(패키지 `sideEffects: true`)
- 스타일이 이상하다
  - `@import "@design-system/core/styles/tokens.css";`가 전역에 1회 적용됐는지 확인
  - 특정 화면에서만 다르면, CSS 스코프/우선순위 문제인지 확인
- 이벤트가 안 잡힌다
  - `onChange` 같은 프레임워크 전용 핸들러 대신 `addEventListener`로 우회
  - `event.target` 대신 `event.currentTarget` 사용
