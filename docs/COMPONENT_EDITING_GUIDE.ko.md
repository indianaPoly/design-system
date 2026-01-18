# 컴포넌트 수정(기여) 가이드 (Korean)

이 문서는 **이 저장소의 Lit 기반 Web Components(`ds-*`)를 직접 수정/확장**할 때, “어디를 어떻게 고쳐야 하는지”를 빠르게 잡을 수 있도록 정리한 가이드입니다.

- 소비(사용) 가이드는 `SKILL.example.md`를 참고하세요.
- 이 문서는 **리포지토리 내부 코드를 수정하는 사람**을 위한 문서입니다.

---

## 1) 전체 구조 한눈에 보기

- 컴포넌트 구현: `src/components/ds-*.ts`
- 토큰(테마 변수): `src/styles/tokens.css`
- 퍼블릭 export: `src/index.ts`
- 테스트: `tests/*.test.ts` (Vitest + jsdom)
- 프리뷰(Storybook 대체): `docs/` (`docs/main.ts`, `docs/index.html`)

---

## 2) 변경 요구사항 → 수정 위치(치트시트)

| 변경 요구사항 | 보통 수정할 파일 | 코멘트 |
|---|---|---|
| Alert 배경/테두리/라운드/패딩/폰트만 바꾸고 싶다 | `src/styles/tokens.css` | 컴포넌트는 `--ds-alert-*`를 소비하도록 되어 있음 |
| 특정 variant(`info/success/warning/danger`)의 색만 바꾸고 싶다 | `src/styles/tokens.css` | `--ds-alert-<variant>-bg`, `--ds-alert-<variant>-border-color` |
| 마크업 구조(예: title 위치, wrapper tag) 변경 | `src/components/ds-alert.ts` + `tests/ds-alert.test.ts` | DOM/접근성 영향 → 테스트 업데이트 필요 |
| 접근성(role/aria 등) 개선 | `src/components/ds-alert.ts` + 테스트 | `role`, 제목/본문 관계, slot 기본값 등 확인 |
| 새로운 Prop/Attribute 추가 | `src/components/ds-alert.ts` + `tests/ds-alert.test.ts` (+ 필요 시 `docs/main.ts`) | 기존 API 변경은 breaking 가능성 → 신중 |
| 새로운 variant 추가 | `src/components/ds-alert.ts` + `src/styles/tokens.css` + 테스트 + 문서 | `AlertVariant` 타입/스타일/토큰/예시 전부 필요 |
| 외부에서 스타일링 가능 지점 추가 | `src/components/ds-alert.ts` | `part="..."` 추가/정리 |
| 라이브러리 외부에서 import 경로로 노출 | `src/index.ts` | 새 컴포넌트면 export 필수 |

---

## 3) ds-alert를 기준으로 “코드 읽는 법”

파일: `src/components/ds-alert.ts`

### 3-1. Public API(Props/Attributes)

```ts
export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

@property({ type: String, reflect: true })
declare variant: AlertVariant;

@property({ type: String })
declare title: string;
```

- `variant`
  - `reflect: true`라서 **property → attribute**로 반영됩니다.
  - HTML에서도 `<ds-alert variant="warning">`처럼 설정 가능합니다.
- `title`
  - `reflect`가 없어서 **property 값이 attribute로 다시 반영되진 않습니다.**
  - 하지만 Lit의 기본 동작으로 **attribute → property**는 여전히 들어옵니다.

### 3-2. Default 값은 constructor에서

```ts
constructor() {
  super();
  this.variant = 'info';
  this.title = '';
}
```

- “기본 동작”을 바꾸려면 여기부터 봅니다.

### 3-3. 렌더 구조(슬롯/파트/접근성)

```ts
<section class="alert" part="alert" role="status">
  <strong class="title" part="title">
    <slot name="title">${this.title}</slot>
  </strong>
  <div class="body" part="body">
    <slot></slot>
  </div>
</section>
```

핵심 포인트:
- `part="alert" | "title" | "body"`
  - 소비자는 `ds-alert::part(title)`처럼 스타일링 할 수 있습니다.
- `slot name="title"` + fallback `${this.title}`
  - 우선순위: `slot="title"` 콘텐츠가 있으면 그걸 렌더, 없으면 `title` prop을 렌더
- `role="status"`
  - 상태 메시지(비동기 완료/오류 등)에 유용한 접근성 힌트입니다.

### 3-4. 스타일은 “토큰 소비”가 기본

`ds-alert.ts`는 **직접 색을 하드코딩하지 않고** 대부분 CSS 커스텀 프로퍼티로 소비합니다.

예:
- 공통 토큰
  - `--ds-alert-radius`, `--ds-alert-padding-x/y`, `--ds-alert-bg`, `--ds-alert-text-color`, `--ds-alert-title-weight`
- variant 토큰
  - `--ds-alert-info-border-color`, `--ds-alert-info-bg`
  - `--ds-alert-success-border-color`, `--ds-alert-success-bg`
  - `--ds-alert-warning-border-color`, `--ds-alert-warning-bg`
  - `--ds-alert-danger-border-color`, `--ds-alert-danger-bg`

즉 “시각적인 변경”은 **컴포넌트 코드 수정 없이** `tokens.css`에서 끝내는 게 1순위입니다.

---

## 4) tokens.css에서 토큰을 찾고 수정하는 법

파일: `src/styles/tokens.css`

이 프로젝트는 “글로벌 스위치”를 통해 테마/플랫폼을 바꿉니다.

- 기본: `:root { ... }`
- 다크: `:root[data-ds-theme="dark"] { ... }`
- iOS: `:root[data-ds-platform="ios"] { ... }`
- iOS + 다크: `:root[data-ds-platform="ios"][data-ds-theme="dark"] { ... }`

### 4-1. ds-alert 토큰이 정의된 위치

- 기본 토큰: `:root` 블록에 `--ds-alert-*`들
- iOS 오버라이드: `:root[data-ds-platform="ios"]` 블록에 `--ds-alert-*` 오버라이드
- iOS 다크 오버라이드: `:root[data-ds-platform="ios"][data-ds-theme="dark"]` 블록에 `--ds-alert-*` 오버라이드

### 4-2. 안전한 수정 전략

1) “특정 컴포넌트만” 변경하고 싶으면
- `--ds-alert-*`만 바꾸기

2) “테마 전체 톤”을 바꾸고 싶으면
- `--ds-color-*`(semantic 토큰)부터 바꾼 다음, 컴포넌트 토큰은 필요할 때만 오버라이드

3) “한 인스턴스만” 바꾸고 싶으면
- 소비 측에서 inline style이나 클래스 스코프로 `--ds-alert-*` 재정의

---

## 5) 테스트는 어디까지/어떻게 고치나

파일: `tests/ds-alert.test.ts`

현재 테스트는 다음을 검증합니다.
- title 렌더링(텍스트 포함)
- body slot이 존재

변경 유형별 테스트 가이드:
- 렌더 구조(클래스명/파트/슬롯) 변경
  - 테스트도 같이 업데이트해야 합니다.
- 토큰/스타일 값 변경
  - 보통 jsdom에서는 스타일까지 강하게 테스트하지 않습니다.
  - 대신 “구조/속성/역할(role)” 중심으로 테스트를 유지하는 것이 안정적입니다.

---

## 6) 수정 워크플로우(추천)

1) 요구사항이 “시각(색/간격/라운드/그림자)”이면
- 먼저 `src/styles/tokens.css` 수정으로 해결 가능한지 확인

2) 구조/행동 변경이면
- `src/components/ds-*.ts` 수정
- 필요한 경우 `tests/*.test.ts` 업데이트

3) 새 컴포넌트/타입을 추가했다면
- `src/index.ts` export 추가

4) 검증(로컬)
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

---

## 7) 자주 생기는 “헷갈림 포인트”

### 7-1. Shadow DOM 때문에 form submit이 자동으로 안 됨
`ds-input`, `ds-checkbox` 등 내부에 `<input>`이 있어도 Shadow DOM 안에 있기 때문에, 기본 HTML form submit에 값이 자동으로 포함되지 않습니다.

- 폼 제출이 필요하면 애플리케이션에서 값을 수집해 처리하거나,
- 장기적으로는 **Form-Associated Custom Elements**(ElementInternals) 형태로 컴포넌트를 확장하는 방향을 고려해야 합니다(현재 구현은 해당 기능을 사용하지 않습니다).

### 7-2. Attribute vs Property
- HTML에서 초기값을 줄 때는 attribute가 편합니다.
- 런타임에서 값을 제어할 때는 **property 설정**이 가장 확실합니다.
- `reflect: true` 여부에 따라 property가 attribute로 “되돌아오냐”가 달라집니다.

---

## 8) ds-alert 수정 예시

### 예시 A) iOS 다크에서 alert 배경만 더 진하게

`src/styles/tokens.css`의 `:root[data-ds-platform="ios"][data-ds-theme="dark"]`에서:

```css
:root[data-ds-platform="ios"][data-ds-theme="dark"] {
  --ds-alert-bg: rgba(118, 118, 128, 0.3);
}
```

### 예시 B) warning variant를 더 “주의” 톤으로

```css
:root {
  --ds-alert-warning-border-color: rgba(245, 158, 11, 0.45);
  --ds-alert-warning-bg: rgba(245, 158, 11, 0.2);
}
```

### 예시 C) 특정 화면에서만 alert 라운드를 크게

(소비 코드)

```html
<ds-alert style="--ds-alert-radius: 20px" title="안내">내용</ds-alert>
```
