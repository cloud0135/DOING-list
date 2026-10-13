import { Link } from 'react-router-dom'
import { useTodos } from '../features/todos/todoContext'

export function RepositoriesPage() {
  const { todos } = useTodos()

  return (
    <div className="mx-auto max-w-3xl py-8 lg:py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink">GitHub 리포지터리 관리</h1>
      <p className="mt-3 text-sm text-muted">프로젝트 또는 업무를 선택해 연결된 리포지터리를 확인하세요.</p>

      <ul className="mt-8 space-y-3">
        {todos.map((todo) => (
          <li className="overflow-hidden rounded-2xl bg-white" key={todo.id}>
            <Link
              className="flex items-center justify-between gap-4 px-5 py-5 transition-colors hover:bg-accent-soft/40"
              to={`/repositories/${todo.id}`}
            >
              <span className="min-w-0">
                <span className="block font-medium text-ink">{todo.title}</span>
                <span className="mt-1 block text-sm text-muted">
                  {todo.repository ? `연결됨: ${todo.repository.name}` : '리포지터리 미연결'}
                </span>
              </span>
              <span aria-hidden="true" className="shrink-0 text-2xl text-ink">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
