import { Link } from 'react-router-dom'

const repositoryPreview = [
  { name: 'doing-list', description: 'Todo와 GitHub 레포를 연결하는 프로젝트', language: 'TypeScript' },
  { name: 'portfolio-site', description: '개인 포트폴리오 화면을 구성하는 프로젝트', language: 'React' },
  { name: 'study-notes', description: '개발 학습 내용을 정리하는 프로젝트', language: 'Markdown' },
]

export function RepositoriesPage() {
  return (
    <div className="py-10 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Todo에 레포 연결</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-zinc-950 dark:text-white">공개 레포 선택</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            로그인한 사용자의 공개 레포를 검색하고 선택하는 화면 기반이에요.
          </p>
        </div>
        <Link className="text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400" to="/">
          Todo 화면으로 돌아가기
        </Link>
      </div>

      <section className="mt-10 max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_16px_40px_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none" aria-labelledby="repository-list-heading">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="repository-search">레포 검색</label>
          <input
            className="min-w-0 flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:placeholder:text-zinc-600"
            id="repository-search"
            placeholder="레포 이름으로 검색"
            type="search"
          />
          <button className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400" disabled type="button">
            검색
          </button>
        </div>

        <div className="mt-8 flex items-end justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold" id="repository-list-heading">공개 레포 목록</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">API 연결 후 실제 목록으로 교체할 영역</p>
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">3개 예시</span>
        </div>

        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {repositoryPreview.map((repository) => (
            <li className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between" key={repository.name}>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{repository.name}</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{repository.description}</p>
                <span className="mt-3 inline-block rounded-lg bg-zinc-100 px-2 py-1 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {repository.language}
                </span>
              </div>
              <button className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-500" disabled type="button">
                선택
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">현재 목록은 화면 설계용 예시 데이터예요.</p>
    </div>
  )
}
