# DOING-list 기획 변경 및 기능 안내

## 1. 프로젝트 한 줄 소개

DOING-list는 할 일을 관리하면서 각 Todo에 GitHub 레포를 연결해 개발 작업의 맥락까지 함께 관리하는 웹 애플리케이션이다.

핵심은 AI 서비스가 아니라 Todo 관리다. GitHub와 AI는 Todo를 더 잘 관리하기 위한 확장 기능으로 사용한다.

## 2. 초기 기획에서 변경된 점

### Todo 중심에서 개발 작업 관리로 확장

처음에는 일반적인 Todo 리스트를 만드는 것을 목표로 했다. 이후 개발자가 자신의 GitHub 레포를 Todo에 연결하면 작업의 목적과 진행 상황을 더 쉽게 관리할 수 있다고 판단해 GitHub 기능을 추가했다.

### GitHub 로그인 우선

로그인 방식은 여러 소셜 로그인을 한 번에 지원하지 않고 GitHub 로그인을 먼저 구현한다.

- 1차: GitHub 로그인
- 추후: Google 로그인
- Google 로그인 사용자가 GitHub 기능을 사용하려면 별도의 GitHub 계정 연결이 필요할 수 있다.

### 공개 레포부터 지원

1차 MVP에서는 로그인한 사용자의 공개 GitHub 레포만 조회한다.

- 1차: 공개 레포 조회·검색·선택
- 추후: 비공개 레포 조회
- Todo 하나에 GitHub 레포 하나를 연결한다.

비공개 레포를 지원하려면 접근 권한 확인, GitHub App 또는 별도 서버 처리, 권한 오류 및 연결 해제 처리가 추가로 필요하다. 따라서 공개 레포 기능을 먼저 안정화한 뒤 확장한다.

### AI 기능 추가

GitHub 레포를 선택한 뒤 AI가 프로젝트의 현재 단계를 요약해주는 기능을 계획에 추가했다.

- 사용할 AI API: Google Gemini
- AI 역할: 선택한 레포의 README, 파일 구조, 커밋 정보 등을 바탕으로 현재 단계 요약
- 예상 결과: 완료된 작업, 진행 중인 작업, 남은 작업, 다음에 할 일
- 적용 시점: GitHub 공개 레포 연결 기능을 완성한 후 확장 기능으로 구현

Gemini API 키는 프론트엔드에 노출하지 않는다. 실제 AI 기능을 구현할 때는 서버 또는 GCP 환경의 비밀 변수로 관리한다.

## 3. 1차 MVP 범위

### 포함하는 기능

- Todo 생성
- Todo 수정
- Todo 삭제
- Todo 완료 상태 변경
- Todo 마감일 설정
- 마감일이 없는 Todo 저장
- Todo 정렬 기준 선택
  - 마감일순
  - 생성일순
  - 제목순
- 기본 정렬 기준은 마감일순
- 마감일이 없는 Todo는 마감일이 있는 Todo 뒤에 표시
- GitHub 로그인
- 로그인한 사용자의 공개 레포 조회
- 레포 이름 검색
- 레포 선택
- Todo별 GitHub 레포 연결
- 연결된 레포의 GitHub 페이지 열기

### MVP에서 제외하는 기능

- 비공개 레포 조회
- Google 로그인
- Gemini 레포 분석
- Todo 공유
- 반복 일정
- 리스트 보기와 카드 보기 전환
- 오프라인 동기화와 PWA

정렬 기준은 남기되 정렬 방향을 오름차순·내림차순으로 바꾸는 기능은 1차 범위에 포함하지 않는다.

## 4. 로그인 및 데이터 저장 계획

### 비로그인 상태

로그인하지 않은 사용자는 브라우저의 `localStorage`에 Todo를 임시 저장한다.

```text
Todo 작성 → localStorage 저장 → 브라우저에서 계속 사용
```

### GitHub 로그인 상태

GitHub 로그인은 Supabase Auth를 통해 처리한다.

```text
GitHub 로그인
  → Supabase 사용자 세션 확인
  → Supabase에서 계정 Todo 조회
```

### 비로그인 Todo 이전

로그인 시 기존 localStorage Todo를 삭제하거나 덮어쓰지 않고 계정 Todo에 병합한다.

```text
로그인 완료
  → localStorage Todo 확인
  → 기존 서버 Todo와 비교
  → 기존 데이터를 덮어쓰지 않고 병합
  → Supabase 저장 완료
  → localStorage 정리
```

## 5. GitHub 기능 계획

### 1차 연결 흐름

```text
Todo의 레포 연결
  → GitHub 로그인 여부 확인
  → 공개 레포 목록 조회
  → 레포 이름 검색
  → 레포 선택
  → Todo에 레포 정보 저장
  → GitHub 레포 페이지 열기
```

### 저장할 레포 정보

- 레포 ID
- 레포 이름
- 소유자 이름
- 레포 URL
- 기본 브랜치 정보

모든 Todo가 레포를 가져야 하는 것은 아니다. 레포 연결은 선택 기능으로 둔다.

## 6. AI 기능 확장 계획

AI 기능은 사용자가 Todo에 연결한 레포를 기준으로 동작한다.

```text
Todo 선택
  → 연결된 공개 레포 확인
  → 분석 요청
  → 서버에서 GitHub 데이터 조회
  → Gemini에 분석 요청
  → 프로젝트 현재 단계 요약 표시
```

### AI가 제공할 내용

- 프로젝트의 목적 요약
- 현재 구현된 기능
- 최근 작업 흐름
- 진행 중으로 보이는 작업
- 남은 작업 후보
- 다음 개발 단계 제안

### AI 기능 구현 시 주의사항

- Gemini API 키를 React 코드에 저장하지 않는다.
- `.env`와 비밀 키를 GitHub에 업로드하지 않는다.
- 공개 레포만 분석하는 MVP 범위를 먼저 지킨다.
- AI의 요약은 참고 정보로 표시하고 사실로 단정하지 않는다.
- 레포 데이터가 부족할 때는 분석 불가 상태를 보여준다.

## 7. 현재 기술 스택

### 프론트엔드

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand 예정

### 인증 및 데이터

- Supabase Auth
- Supabase Database
- GitHub OAuth
- GitHub REST API

### AI 및 배포

- Google Gemini API 예정
- Google Cloud Platform
- Google Cloud Run

## 8. 현재 구현 상태

현재는 세부 기능보다 사용자가 볼 수 있는 화면의 기반을 먼저 구성한 상태다.

### 완료

- React + TypeScript + Vite 프로젝트 구성
- Tailwind CSS 설정
- 화면 라우팅 기반 구성
- 메인 Todo 화면 기반
- GitHub 로그인 화면 기반
- 공개 레포 선택 화면 기반
- 빈 화면·로딩·오류·데이터 이전 상태 화면 기반
- 사용자 흐름 문서 작성
- GitHub 저장소에 초기 프론트엔드 커밋 및 push

### 아직 구현하지 않은 기능

- 실제 Todo 저장
- Zustand 상태 관리
- localStorage 연동
- Supabase 연결
- GitHub OAuth 연결
- GitHub 공개 레포 API 연결
- Gemini 분석 API 연결
- GCP 배포

현재 화면 경로:

```text
/               메인 Todo 화면
/login          GitHub 로그인 화면
/repositories   공개 레포 선택 화면
/states         빈 화면·로딩·오류·데이터 이전 상태
```

## 9. 다음 개발 순서

1. 화면 기반 검토 및 스타일 조정
2. Zustand로 Todo 상태 관리
3. localStorage 저장
4. Todo 생성·수정·삭제 기능 구현
5. Supabase 프로젝트 및 Todo 테이블 설정
6. GitHub OAuth 로그인 연결
7. 공개 레포 조회·검색·선택 연결
8. Todo와 GitHub 레포 정보 저장
9. 테스트 및 오류 처리
10. GCP Cloud Run 배포
11. Gemini 분석 기능 확장
12. 비공개 레포와 Google 로그인 검토

## 관련 문서

- [사용자 흐름](USER_FLOW.md)
- [상세 사용자 흐름](docs/user-flow.md)
