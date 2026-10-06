## DOING-list

Todo에 GitHub 공개 레포를 연결해 진행중인 업무들을 관리해주는 웹 애플리케이션.
기획 추가: 개발 작업 단계를 분석하고 진행 상황을 알려주는 기능 추가됨.


### 프로젝트 소개

DOING-list는 기본적인 Todo 관리 기능을 중심임. 진행 단계를 간단하게 보여주는 게 핵심.
개발자가 각 작업과 관련된 GitHub 레포를 연결할 수 있도록 만든 프로젝트.

1차 MVP에서는 GitHub로 로그인한 사용자의 공개 레포를 조회하고, 원하는 레포를 Todo에 연결하는 기능까지 구현.
추가로 비공개 레포 조회는 도전 기능.

### 1차 MVP 범위

#### Todo 기능

- Todo 생성, 수정, 삭제
- Todo 완료 처리
- 마감일 설정
- 마감일순, 생성일순, 제목순 정렬
- 기본 정렬 기준은 마감일순
- 마감일이 없는 Todo는 마감일이 있는 Todo 뒤에 표시

#### GitHub 기능

- GitHub 로그인
- 로그인한 사용자의 공개 레포 조회
- 레포 이름 검색
- Todo마다 GitHub 레포 하나 연결
- 연결한 레포의 GitHub 페이지 열기
- 연결된 레포 해제
- 연결된 레포 조회 및 분석

### 현재 제외하는 기능

다음 기능은 1차 MVP 이후 확장합니다.

- 비공개 레포 조회
- Gemini를 이용한 레포 분석
- Google 로그인
- Todo 공유
- 반복 일정
- 리스트 보기와 카드 보기 전환
- 오프라인 동기화와 PWA

### 향후 확장 계획

#### Gemini 레포 분석

공개 레포의 README, 파일 구조, 커밋 정보를 분석해 다음 내용을 제공할 예정입니다.

- 현재 프로젝트 개발 단계
- 완료된 작업
- 진행 중인 작업
- 남은 작업
- 다음에 할 일을 추천

Gemini API 키는 브라우저에 노출하지 않고 서버에서만 사용합니다.

#### 비공개 레포 지원

비공개 레포 지원 시 GitHub App과 서버를 추가합니다.

- 사용자가 접근을 허용한 레포만 조회
- 레포 접근 권한 관리
- GitHub API 호출을 서버에서 처리
- 권한 해제와 접근 오류 처리

현재 공개 레포 기능과 이후 비공개 레포 기능을 분리할 수 있도록 GitHub API와 레포 선택 UI를 별도 모듈로 구성합니다.

#### 추가 로그인 방식

Google 로그인을 추가할 수 있습니다. 다만 Google로 로그인한 사용자가 GitHub 레포 기능을 사용하려면 별도의 GitHub 계정 연결 과정이 필요합니다.

### 기술 스택

#### Frontend

- React
- TypeScript
- Vite
- Zustand
- React Router
- Tailwind CSS

#### Backend 및 데이터

- Supabase Auth
- Supabase Database
- GitHub OAuth
- GitHub REST API

#### 배포

- Google Cloud Platform
- Google Cloud Run

### 예정 폴더 구조

```text
src/
├─ components/
├─ pages/
│  ├─ HomePage.tsx
│  └─ LoginPage.tsx
├─ features/
│  ├─ todos/
│  │  ├─ components/
│  │  ├─ todo.api.ts
│  │  ├─ todo.store.ts
│  │  └─ todo.types.ts
│  ├─ auth/
│  │  ├─ auth.api.ts
│  │  ├─ auth.store.ts
│  │  └─ GithubLoginButton.tsx
│  └─ github/
│     ├─ github.api.ts
│     ├─ github.types.ts
│     └─ RepositorySelector.tsx
├─ lib/
│  ├─ supabase.ts
│  └─ github.ts
├─ App.tsx
└─ main.tsx
```

### 주요 데이터 구조

Todo에는 GitHub 레포를 선택적으로 연결할 수 있도록 레포 정보 필드를 둡니다.

```text
todos
├─ id
├─ user_id
├─ title
├─ is_completed
├─ deadline
├─ created_at
├─ github_repository_id
├─ github_repository_name
└─ github_repository_url
```

`github_repository_id`는 비어 있을 수 있습니다. 따라서 모든 Todo가 레포를 가져야 하는 것은 아닙니다.

### 로컬 실행 방법

프로젝트 의존성 설치:

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

### 환경변수

`.env.local` 파일을 만들고 Supabase 정보를 입력합니다.

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

환경변수 파일에는 비밀번호, 개인 토큰, Gemini API 키를 저장하거나 GitHub에 업로드하지 않습니다.

### GitHub 로그인 설정

1. GitHub OAuth App 생성
2. Supabase Authentication에서 GitHub Provider 활성화
3. GitHub OAuth App에 Supabase callback URL 등록
4. Supabase URL과 Client ID, Client Secret 설정
5. 로컬 및 배포 환경의 Redirect URL 등록

### 개발 단계

1. 폴더 확인
2. React + TypeScript 프로젝트 생성
3. 기본 패키지 설치
4. 폴더 구조 생성
5. 기본 Todo 화면 구현
6. Supabase 연결
7. GitHub 로그인 구현
8. 로그인 사용자의 공개 레포 조회
9. Todo별 레포 연결
10. 테스트 및 오류 처리
11. GCP Cloud Run 배포
12. Gemini 분석과 비공개 레포 기능 확장

### 저장소

[GitHub - DOING-list](https://github.com/cloud0135/DOING-list)

## 프로젝트 상태

현재 개발 초기 단계이며, 1차 목표는 GitHub 로그인과 공개 레포 연결 기능을 포함한 Todo MVP 완성입니다.
