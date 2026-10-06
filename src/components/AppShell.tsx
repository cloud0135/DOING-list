import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'

type AppShellProps = {
  children: ReactNode
}

const navClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
      : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
  }`

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-[100dvh] bg-[#f7f8f7] text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col px-4 py-4 sm:px-6 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
          <Link className="text-lg font-semibold tracking-[-0.04em]" to="/">
            DOING<span className="text-emerald-600 dark:text-emerald-400">.</span>
          </Link>

          <nav aria-label="주요 메뉴" className="order-3 flex w-full gap-1 sm:order-2 sm:w-auto">
            <NavLink className={navClassName} end to="/">
              Todo
            </NavLink>
            <NavLink className={navClassName} to="/repositories">
              GitHub 레포
            </NavLink>
            <NavLink className={navClassName} to="/states">
              화면 상태
            </NavLink>
          </nav>

          <Link
            className="order-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:-translate-y-px hover:border-zinc-400 active:translate-y-px dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 sm:order-3"
            to="/login"
          >
            GitHub 로그인
          </Link>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-zinc-200/80 py-5 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          화면 구조를 먼저 확인하는 프론트엔드 프로토타입
        </footer>
      </div>
    </main>
  )
}
