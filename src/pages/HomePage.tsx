import { Link } from 'react-router-dom'

const previewTodos = [
  { title: 'GitHub 공개 레포 연결 흐름 정리', meta: '마감일 10월 08일', status: '진행 중' },
  { title: 'Todo 화면 와이어프레임 작성', meta: '마감일 10월 10일', status: '진행 중' },
  { title: 'README 프로젝트 설명 업데이트', meta: '마감일 없음', status: '완료' },
]

export function HomePage() {
  return (
    <div className="py-10 lg:py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">오늘의 작업</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-zinc-950 sm:text-5xl dark:text-white">
          해야 할 일을 정리하고, 하나씩 끝내요.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Todo에 GitHub 공개 레포를 연결해서 작업의 맥락까지 한 곳에서 관리하세요.
        </p>
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <section aria-labelledby="todo-composer-heading">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_16px_40px_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold" id="todo-composer-heading">
                  Todo 추가 영역
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">제목과 마감일을 입력하는 화면 기반</p>
              </div>
              <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                화면 기반
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-600">
                Todo 제목을 입력하세요
              </div>
              <button className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white" disabled type="button">
                Todo 추가
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                마감일 선택
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">마감일은 선택 항목이에요.</span>
            </div>
          </div>

          <section className="mt-10" aria-labelledby="todo-list-heading">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.04em]" id="todo-list-heading">
                  Todo 목록
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">목록과 정렬 컨트롤이 들어갈 영역</p>
              </div>
              <div className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                기본 정렬: 마감일순
              </div>
            </div>

            <ul className="mt-5 divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/80">
              {previewTodos.map((todo) => (
                <li className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5" key={todo.title}>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 size-4 rounded border border-zinc-300 dark:border-zinc-600" />
                    <div>
                      <p className={`font-medium ${todo.status === '완료' ? 'text-zinc-400 line-through dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {todo.title}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{todo.meta}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-7 sm:pl-0">
                    <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                      레포 연결
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">{todo.status}</span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">위 목록은 화면 구조 확인을 위한 예시 데이터예요.</p>
          </section>
        </section>

        <aside className="self-start rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/80">
          <p className="text-sm font-semibold">작업 현황 영역</p>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-950">
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">전체</dt>
              <dd className="mt-1 text-2xl font-semibold">3</dd>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
              <dt className="text-xs text-emerald-700 dark:text-emerald-400">진행 중</dt>
              <dd className="mt-1 text-2xl font-semibold text-emerald-700 dark:text-emerald-400">2</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <p className="text-sm font-semibold">GitHub 연결 영역</p>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              개발자이신가요? GitHub로 로그인하면 공개 레포를 연결할 수 있어요.
            </p>
            <Link
              className="mt-4 block rounded-xl border border-zinc-300 px-3 py-2.5 text-center text-sm font-medium text-zinc-700 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
              to="/login"
            >
              로그인 화면 보기
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
