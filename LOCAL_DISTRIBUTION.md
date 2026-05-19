# 로컬 tar.gz 배포 가이드

이 저장소는 npm registry에 배포하지 않아도 사용할 수 있도록 로컬 배포용 아카이브를 만들 수 있습니다.

## 목적

- 다른 컴퓨터에서 `@design-system/core`를 **로컬 파일로 설치**
- 같은 아카이브 안에 **정적 preview 문서**도 함께 제공

## 생성 명령어

```bash
bun run release:archive
```

실행하면 아래 산출물이 생성됩니다.

- `artifacts/design-system-local-v<version>.tar.gz`
- `artifacts/design-system-local/`
  - `*.tgz` : 설치용 패키지 tarball
  - `preview/` : 다른 컴퓨터에서 실행 가능한 정적 문서
  - `INSTALL.md` : 설치/실행 안내

## 다른 컴퓨터에서 사용하는 방법

### 1. 압축 해제

```bash
tar -xzf design-system-local-v<version>.tar.gz
cd design-system-local
```

### 2. 프로젝트에 설치

#### Bun

```bash
bun add file:./design-system-core-<version>.tgz
```

#### npm

```bash
npm install ./design-system-core-<version>.tgz
```

### 3. 코드에서 사용

```ts
import '@design-system/core';
import '@design-system/core/styles/tokens.css';
```

### 4. Preview 실행

```bash
python3 -m http.server 4173 -d preview
```

브라우저에서 아래 주소로 확인합니다.

```txt
http://127.0.0.1:4173
```
