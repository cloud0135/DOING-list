import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <div className="grid min-h-[620px] items-center py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20 lg:py-20">
      <section className="max-w-xl">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">GitHub 연결</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-zinc-950 sm:text-5xl dark:text-white">
          개발 작업을
          <span className="block text-emerald-600 dark:text-emerald-400">레포와 함께 관리하세요.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400">
          GitHub 로그인 후 내 공개 레포를 Todo에 연결할 수 있어요.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_16px_40px_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none" aria-labelledby="login-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">Sign in</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]" id="login-heading">GitHub로 로그인</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          로그인 화면의 입력과 안내 영역을 먼저 배치했어요. 실제 OAuth 연결은 다음 단계에서 구현합니다.
        </p>
        <button className="mt-7 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900" disabled type="button">
          GitHub로 계속하기
        </button>
        <Link className="mt-4 block text-center text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400" to="/">
          Todo 화면으로 돌아가기
        </Link>
      </section>
    </div>
  )
}
