import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type StatePanelProps = {
  id: string
  title: string
  description: string
  children: ReactNode
}

function StatePanel({ children, description, id, title }: StatePanelProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/80" id={id}>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-950">{children}</div>
    </section>
  )
}

export function StatesPage() {
  return (
    <div className="py-10 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">상태 화면</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-zinc-950 dark:text-white">예외 상태 기반</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            데이터 연결 후 사용자가 마주하게 될 빈 화면, 로딩, 오류, 이전 상태의 자리예요.
          </p>
        </div>
        <Link className="text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400" to="/">
          Todo 화면으로 돌아가기
        </Link>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <StatePanel description="처음 접속했을 때 Todo가 없는 상태" id="empty" title="Todo 없음">
          <div className="py-8 text-center">
            <p className="font-semibold">첫 번째 Todo를 추가해보세요.</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">해야 할 일을 입력하면 목록이 시작돼요.</p>
          </div>
        </StatePanel>

        <StatePanel description="Todo 또는 레포 목록을 불러오는 중인 상태" id="loading" title="로딩">
          <div className="space-y-3 py-3" aria-label="불러오는 중" role="status">
            <div className="motion-safe:animate-pulse rounded-lg bg-zinc-200 py-3 dark:bg-zinc-800" />
            <div className="motion-safe:animate-pulse w-4/5 rounded-lg bg-zinc-200 py-3 dark:bg-zinc-800" />
            <div className="motion-safe:animate-pulse w-3/5 rounded-lg bg-zinc-200 py-3 dark:bg-zinc-800" />
          </div>
        </StatePanel>

        <StatePanel description="Supabase 또는 GitHub API 요청이 실패한 상태" id="error" title="오류">
          <div className="py-6">
            <p className="font-semibold text-rose-700 dark:text-rose-400">목록을 불러오지 못했어요.</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">잠시 후 다시 시도해주세요.</p>
            <button className="mt-5 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300" disabled type="button">
              다시 시도
            </button>
          </div>
        </StatePanel>

        <StatePanel description="비로그인 Todo를 로그인 계정으로 옮기는 중인 상태" id="migration" title="데이터 이전">
          <div className="py-6">
            <p className="font-semibold">기존 Todo를 계정에 연결하고 있어요.</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">화면을 닫지 말고 잠시 기다려주세요.</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div className="h-full w-2/5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </StatePanel>
      </div>
    </div>
  )
}
