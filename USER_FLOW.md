# DOING-list 사용자 흐름

## 기획 범위

### MVP

- GitHub 로그인
- 비로그인 상태의 Todo 작성 및 저장
- 로그인 후 기존 Todo를 Supabase로 이전
- Todo 추가·수정·완료·삭제
- Todo별 GitHub 공개 레포 연결
- GitHub 공개 레포 검색·선택
- 연결한 레포 페이지로 이동
- 마감일·생성일·제목 기준 정렬
- 기본 정렬 기준은 마감일순

### 추후 확장

- 비공개 GitHub 레포 조회
- Google 로그인
- Gemini API를 이용한 레포 분석 및 현재 단계 요약

## 1. 전체 사용자 흐름

```mermaid
flowchart TD
    START([DOING-list 접속]) --> LOGIN{GitHub 로그인 여부}

    LOGIN -->|비로그인| GUEST[Todo 화면 진입\n비회원 모드]
    LOGIN -->|로그인| OAUTH[GitHub OAuth 로그인]

    OAUTH --> AUTH_RESULT{로그인 성공 여부}
    AUTH_RESULT -->|실패 또는 취소| AUTH_ERROR[로그인 실패 안내]
    AUTH_ERROR --> GUEST
    AUTH_RESULT -->|성공| MIGRATE{localStorage에\n기존 Todo가 있는가?}

    MIGRATE -->|없음| LOAD[Supabase에서 Todo 불러오기]
    MIGRATE -->|있음| MERGE[기존 Todo를 Supabase에 병합]
    MERGE --> CLEAR[localStorage 데이터 삭제]
    CLEAR --> LOAD

    GUEST --> TODO[Todo 목록 화면]
    LOAD --> TODO

    TODO --> ACTION{수행할 작업}
    ACTION --> ADD[Todo 추가]
    ACTION --> EDIT[Todo 수정]
    ACTION --> COMPLETE[완료 상태 변경]
    ACTION --> DELETE[Todo 삭제]
    ACTION --> SORT[정렬 기준 변경]
    ACTION --> REPO[GitHub 레포 연결]

    ADD --> SAVE[Todo 저장]
    EDIT --> SAVE
    COMPLETE --> SAVE
    DELETE --> SAVE
    SORT --> TODO
    REPO --> TODO
    SAVE --> TODO
```

## 2. Todo 추가 흐름

```mermaid
flowchart TD
    ADD([Todo 추가]) --> TITLE[Todo 제목 입력]
    TITLE --> DEADLINE{마감일 입력 여부}

    DEADLINE -->|입력함| WITH_DATE[마감일과 함께 저장]
    DEADLINE -->|입력하지 않음| WITHOUT_DATE[마감일 없이 저장]

    WITH_DATE --> VALIDATE{제목이 입력되었는가?}
    WITHOUT_DATE --> VALIDATE

    VALIDATE -->|아니오| ERROR[제목 입력 안내]
    ERROR --> TITLE
    VALIDATE -->|예| LOGIN_STATE{로그인 상태인가?}

    LOGIN_STATE -->|비로그인| LOCAL[localStorage에 저장]
    LOGIN_STATE -->|로그인| SUPABASE[Supabase에 저장]

    LOCAL --> LIST[Todo 목록 갱신]
    SUPABASE --> LIST
```

## 3. GitHub 공개 레포 연결 흐름

```mermaid
flowchart TD
    LINK([Todo의 레포 연결]) --> CHECK{GitHub 로그인 여부}

    CHECK -->|비로그인| GUIDE[로그인 안내\n"개발자이신가요? GitHub로 로그인해보세요"]
    GUIDE --> OAUTH[GitHub 로그인]
    OAUTH --> RESULT{로그인 성공 여부}
    RESULT -->|실패 또는 취소| RETURN[Todo 화면으로 돌아가기]
    RESULT -->|성공| REPOS[공개 레포 목록 조회]

    CHECK -->|로그인 상태| REPOS
    REPOS --> API{조회 결과}

    API -->|성공| LIST[공개 레포 목록 표시]
    API -->|실패| API_ERROR[레포 목록 조회 실패 안내]
    API_ERROR --> RETURN

    LIST --> SEARCH[레포 이름 검색]
    SEARCH --> RESULT_LIST{검색 결과가 있는가?}
    RESULT_LIST -->|없음| EMPTY[검색 결과 없음]
    EMPTY --> SEARCH
    RESULT_LIST -->|있음| SELECT[레포 선택]

    SELECT --> CONNECT[Todo에 레포 연결]
    CONNECT --> SAVE[연결 정보 저장]
    SAVE --> TODO[Todo에 연결된 레포 표시]
    TODO --> OPEN{GitHub에서 열기}
    OPEN -->|예| GITHUB[GitHub 레포 페이지]
    OPEN -->|아니오| RETURN
```

## 4. 정렬 흐름

정렬 방향을 따로 바꾸는 기능은 제공하지 않는다. 정렬 기준만 선택한다.

```mermaid
flowchart TD
    LIST([Todo 목록]) --> DEFAULT[기본값: 마감일순]
    DEFAULT --> SELECT{정렬 기준 선택}

    SELECT -->|마감일| DEADLINE[마감일순]
    SELECT -->|생성일| CREATED[생성일순]
    SELECT -->|제목| TITLE[제목순]

    DEADLINE --> RESULT[정렬된 Todo 목록]
    CREATED --> RESULT
    TITLE --> RESULT
```

### 마감일이 없는 Todo 처리

- 마감일이 없는 Todo도 일반 Todo로 저장한다.
- 마감일이 있는 Todo를 먼저 표시한다.
- 마감일이 없는 Todo는 목록의 마지막에 표시한다.
- 같은 마감일이면 생성일이 빠른 Todo를 먼저 표시한다.

## 5. 로그인 후 데이터 이전

```mermaid
flowchart TD
    LOGIN([GitHub 로그인 성공]) --> SESSION[Supabase 사용자 세션 확인]
    SESSION --> CHECK{localStorage Todo가 있는가?}

    CHECK -->|없음| SERVER[Supabase Todo 조회]
    CHECK -->|있음| COMPARE[서버 Todo와 기존 Todo 확인]
    COMPARE --> APPEND[기존 Todo를 덮어쓰지 않고 병합]
    APPEND --> INSERT[Supabase에 비회원 Todo 저장]
    INSERT --> REMOVE[localStorage 데이터 삭제]
    REMOVE --> SERVER
    SERVER --> SHOW[로그인 계정의 Todo 목록 표시]
```

## 6. 예외 상황

| 상황 | 사용자에게 보여줄 처리 |
| --- | --- |
| GitHub 로그인 취소 | 로그인하지 않고 Todo 화면으로 돌아감 |
| GitHub 로그인 실패 | 로그인 실패 메시지 표시 후 재시도 제공 |
| 공개 레포 조회 실패 | 레포를 불러오지 못했다는 안내와 재시도 제공 |
| 레포 검색 결과 없음 | 검색 결과가 없다는 안내 표시 |
| Todo 제목 미입력 | 제목 입력 안내 후 저장하지 않음 |
| Supabase 저장 실패 | 저장 실패 안내 및 재시도 제공 |

## 7. 추후 확장 흐름

```mermaid
flowchart LR
    TODO[Todo에 레포 연결] -. 추후 .-> PRIVATE[비공개 레포 포함]
    LOGIN[GitHub 로그인] -. 추후 .-> GOOGLE[Google 로그인]
    PRIVATE -. 분석 기능 추가 .-> GEMINI[Gemini API 분석 요청]
    GEMINI --> SUMMARY[프로젝트 현재 단계 요약]
```

## 상세 문서

더 세부적인 상태값과 화면별 흐름은 [docs/user-flow.md](docs/user-flow.md)에서 확인할 수 있다.
