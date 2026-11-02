import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTodos } from '../features/todos/todoContext'
import { previewRepositories } from '../features/todos/todoData'
import { NotFoundPage } from './NotFoundPage'

export function RepositoryDetailPage() {
  const { todoId } = useParams()
  const { todos, setRepository } = useTodos()
  const [search, setSearch] = useState('')
  const todo = todos.find((item) => item.id === todoId)

  if (!todo) return <NotFoundPage />

  const filteredRepositories = previewRepositories.filter((repository) => (
    repository.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  ))

  return (
    <div className="mx-auto max-w-3xl py-8 lg:py-12">
      <Link className="text-sm font-medium text-muted hover:text-ink" to="/repositories">‹ 리포지터리 관리</Link>
      <h1 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-ink sm:text-3xl">
        {todo.title}
      </h1>
      <p className="mt-2 text-sm text-muted">이 업무에 연결할 GitHub 리포지터리를 관리합니다.</p>

      <section aria-labelledby="linked-repository-heading" className="mt-8 rounded-2xl bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-ink" id="linked-repository-heading">현재 연결</h2>
        {todo.repository ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">{todo.repository.name}</p>
              <p className="mt-1 text-sm text-muted">{todo.repository.description}</p>
              {todo.repository.url && (
                <a
                  className="mt-2 inline-block text-sm font-medium text-ink underline decoration-accent underline-offset-4"
                  href={todo.repository.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub에서 열기
                </a>
              )}
            </div>
            <button
              className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft"
              onClick={() => setRepository(todo.id, null)}
              type="button"
            >
              연결 해제
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">아직 연결된 리포지터리가 없어요.</p>
        )}
      </section>

      <section aria-labelledby="repository-list-heading" className="mt-6 rounded-2xl bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-ink" id="repository-list-heading">예시 리포지터리</h2>
        <p className="mt-1 text-sm text-muted">실제 GitHub 목록은 로그인 연결 후 표시됩니다.</p>
        <label className="mt-5 block text-sm font-medium text-ink" htmlFor="repository-search">이름으로 검색</label>
        <input
          className="mt-2 w-full rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink placeholder:text-muted"
          id="repository-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="리포지터리 이름"
          type="search"
          value={search}
        />

        {filteredRepositories.length > 0 ? (
          <ul className="mt-5">
            {filteredRepositories.map((repository) => {
              const isLinked = todo.repository?.id === repository.id

              return (
                <li className="flex flex-wrap items-center justify-between gap-4 py-4" key={repository.id}>
                  <div>
                    <p className="font-medium text-ink">{repository.name}</p>
                    <p className="mt-1 text-sm text-muted">{repository.description}</p>
                    <span className="mt-2 inline-block rounded-lg bg-accent-soft px-2 py-1 text-xs text-ink">
                      {repository.language}
                    </span>
                  </div>
                  <button
                    className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft disabled:cursor-default disabled:bg-surface-muted"
                    disabled={isLinked}
                    onClick={() => setRepository(todo.id, repository)}
                    type="button"
                  >
                    {isLinked ? '연결됨' : '연결'}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-muted">검색 결과가 없어요.</p>
        )}
      </section>
    </div>
  )
}
