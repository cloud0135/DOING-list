import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="grid min-h-[620px] place-items-center py-10 text-center">
      <div>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">페이지를 찾을 수 없음</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em]">이 화면은 아직 없어요.</h1>
        <Link className="mt-6 inline-block text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400" to="/">
          Todo 화면으로 이동
        </Link>
      </div>
    </div>
  )
}
