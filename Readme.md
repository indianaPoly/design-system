# 디자인 시스템 코어

## 프로젝트 소개
이 저장소는 Lit 기반 Web Components로 구성된 프레임워크 독립형 디자인 시스템입니다. 기본적인 UI 컴포넌트와 토큰을 제공하여 다양한 프론트엔드 환경에서 재사용할 수 있도록 설계했습니다. 각 컴포넌트는 CSS 커스텀 프로퍼티를 통해 테마를 쉽게 확장할 수 있습니다.

## 포함 컴포넌트
- `ds-button`: 주요/보조/고스트 버튼
- `ds-card`: 섹션 구성을 위한 카드
- `ds-input`: 라벨/헬퍼/에러를 포함한 입력 필드
- `ds-textarea`: 다중 행 입력 필드
- `ds-checkbox`: 체크박스
- `ds-radio`: 라디오 버튼
- `ds-switch`: 토글 스위치
- `ds-badge`: 상태 표시 배지
- `ds-alert`: 정보/성공/경고/오류 알림

## 토큰 사용
`src/styles/tokens.css`를 통해 색상, 공간, 타이포그래피 토큰을 제공합니다. 프로젝트에서 다음과 같이 가져와 테마의 기본값을 적용할 수 있습니다.

```css
@import "@design-system/core/styles/tokens.css";
```

## 로컬 프리뷰 (Storybook 대체)
토큰과 컴포넌트를 빠르게 확인할 수 있는 로컬 프리뷰 페이지를 제공합니다.

```bash
bun install
bun run docs:dev -- --host 0.0.0.0 --port 4173
```

브라우저에서 `http://localhost:4173`로 접속하면 색상 토큰과 컴포넌트 데모를 확인할 수 있습니다.

## 성능 지표
디자인 시스템은 다양한 서비스에서 재사용되므로, 다음과 같은 지표를 기준으로 성능을 점검합니다.

- 번들 크기: 배포되는 `dist` 산출물 크기를 확인하여 추가되는 컴포넌트가 용량을 과도하게 늘리지 않는지 점검합니다.
- 초기 렌더링 시간: 프리뷰 페이지에서 주요 컴포넌트가 보이기까지의 시간을 측정하여 렌더링 비용을 관리합니다.
- 상호작용 응답성: 버튼/입력 등 인터랙션 요소의 반응 시간을 체크해 UX 저하가 없는지 확인합니다.

## 파일 구조
```
.
├── src
│   ├── components
│   │   ├── ds-alert.ts
│   │   ├── ds-badge.ts
│   │   ├── ds-button.ts
│   │   ├── ds-card.ts
│   │   ├── ds-checkbox.ts
│   │   ├── ds-input.ts
│   │   ├── ds-radio.ts
│   │   ├── ds-switch.ts
│   │   └── ds-textarea.ts
│   ├── index.ts
│   └── styles
│       └── tokens.css
└── tests
    ├── ds-alert.test.ts
    ├── ds-badge.test.ts
    ├── ds-button.test.ts
    ├── ds-checkbox.test.ts
    ├── ds-input.test.ts
    ├── ds-radio.test.ts
    ├── ds-switch.test.ts
    └── ds-textarea.test.ts
```

## 바이브코딩으로 날먹하기

slack + codex를 조합하여 말로만으로 더 좋은 코드를 만들기 위해서 시작한 template입니다.

### 전체 사용 흐름

1. 사용자는 slack (open ai 연동)을 활용하여 PR을 생성할 수 있습니다.
- slack에서 특정 repo에 접근을 하기 위해서는 웹사이트로 접근해 environment를 직접 설정을 해주어야 함.
- 추후에는 jira도 연동해서 task만 추가하면 알아서 PR 만들고 코드도 바로 작업할 수 있도록 고도화 진행 예정

2. codex가 repo의 AGENTS.md 규칙을 읽음

3. scope-guard로 범위를 통제한 상태에서 작업을 수행

4. PR을 하기 전에 pr-preflight 절차를 통해서 해당 코드가 실행 가능한지 검증을 진행

5. PR 초안 생성

### slack에서 잘 사용하는 방법

#### 작업을 요청하는 경우
```txt
[작업 요청]

목표:
- 현재 개발되어있는 로그인 페이지 UI를 react-hook-form을 활용해서 연결 진항
- input 조건은 util 함수를 통해서 관리를 진행하도록 함.
- util 함수에 대한 test 코드 작성

범위:
- frontend/src/components/auth/LoginForm.tsx
- 관련된 util 함수 폴더

비범위:
- 공통 컴포넌트

조건:
- eslint airbnbn 스타일 가이드 유지
- scope-guard 기준으로 garbage diff 방지

작업 후:
- pr-preflight 기준으로 검증
- build 성공 후 PR 초안 작성
```

#### 브랜치를 검증하는 경우
```txt
[검증 요청]

목표: 
- 특정 repo의 특정 브랜치가 PR 가능한 상태인지 검증
- pr-preflight 기준으로 base 최신화 여부 확인
- lint -> test -> build 순으로 검증
- 실패 원인 분석
- 성공시에는 PR 초안 작성
```

### 각 파일들이 하는 역할
1. SKILL.md: codex가 특정 상황에서 따라야할 업무 지침서

2. pr-preflight: PR을 올리기 전에 반드시 거쳐야하는 검증 절차
- base 브랜치(현재 브랜치) 최신화 (merge/rebase)
- lint -> test -> build
- 빌드 실패 시 수정 후 재시도
- 빌드 성공시 PR 초안 작성

3. scope-guard: 작업 범위를 벗어나는 것을 방지하는 안전장치
