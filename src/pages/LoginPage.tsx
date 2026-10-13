import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <div className="grid min-h-[620px] items-center py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20 lg:py-20">
      <section className="max-w-xl">
        <p className="text-sm font-semibold text-ink">GitHub 연결</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-ink sm:text-5xl">
          개발 작업을
          <span className="block text-ink">레포와 함께 관리하세요.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-muted">
          GitHub 로그인 후 내 공개 레포를 Todo에 연결할 수 있어요.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-[0_16px_40px_rgba(75,51,47,0.06)]" aria-labelledby="login-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Sign in</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]" id="login-heading">GitHub로 로그인</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          로그인 화면의 입력과 안내 영역을 먼저 배치했어요. 실제 OAuth 연결은 다음 단계에서 구현합니다.
        </p>
        <button className="mt-7 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-ink disabled:cursor-not-allowed" disabled type="button">
          GitHub로 계속하기
        </button>
        <Link className="mt-4 block text-center text-sm text-muted underline-offset-4 hover:underline" to="/">
          Todo 화면으로 돌아가기
        </Link>
      </section>
    </div>
  )
}
