import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'

type AppShellProps = {
  children: ReactNode
}

const navClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-accent text-ink'
      : 'text-ink hover:bg-accent-soft'
  }`

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-[100dvh] bg-canvas text-ink">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col px-4 py-4 sm:px-6 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <Link className="text-lg font-semibold tracking-[-0.04em]" to="/">
            DOING<span className="text-accent">.</span>
          </Link>

          <nav aria-label="주요 메뉴" className="order-3 flex w-full gap-1 sm:order-2 sm:w-auto">
            <NavLink className={navClassName} end to="/">
              Todo
            </NavLink>
            <NavLink className={navClassName} to="/repositories">
              GitHub 리포지터리 관리
            </NavLink>
          </nav>

          <Link
            className="order-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:-translate-y-px hover:border-accent active:translate-y-px sm:order-3"
            to="/login"
          >
            GitHub 로그인
          </Link>
        </header>

        <div className="flex-1">{children}</div>

      </div>
    </main>
  )
}
