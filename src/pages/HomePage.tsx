import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SewingButtonCheckbox } from '../components/SewingButtonCheckbox'
import { useTodos } from '../features/todos/todoContext'
import { compareDeadlines, compareTitles, dDayLabel, getProgress, isTodoComplete } from '../features/todos/todoData'

type SortBy = 'deadline' | 'name'

export function HomePage() {
  const { todos, toggleChecklistItem, toggleTodoCompleted } = useTodos()
  const [sortBy, setSortBy] = useState<SortBy>('deadline')
  const [slideIndex, setSlideIndex] = useState(0)
  const [expandedTodoIds, setExpandedTodoIds] = useState<string[]>([])
  const pointerStartX = useRef<number | null>(null)

  const deadlineItems = todos.filter((todo) => !isTodoComplete(todo) && todo.dueDate !== null).sort(compareDeadlines)
  const activeSlide = Math.min(slideIndex, Math.max(0, deadlineItems.length - 1))
  const visibleTodos = [...todos].sort(
    sortBy === 'name'
      ? compareTitles
      : compareDeadlines,
  )
  const remainingCount = todos.filter((todo) => !isTodoComplete(todo)).length

  function handleSwipeEnd(clientX: number) {
    if (pointerStartX.current === null) return
    const distance = pointerStartX.current - clientX
    pointerStartX.current = null

    if (Math.abs(distance) < 40) return
    setSlideIndex((current) => Math.max(0, Math.min(current + (distance > 0 ? 1 : -1), deadlineItems.length - 1)))
  }

  function toggleExpanded(todoId: string) {
    setExpandedTodoIds((current) => (
      current.includes(todoId) ? current.filter((id) => id !== todoId) : [...current, todoId]
    ))
  }

  return (
    <div className="py-6 lg:py-8">
      <section aria-labelledby="deadline-summary-heading" className="rounded-2xl bg-white px-4 py-3 shadow-[0_12px_32px_rgba(75,51,47,0.06)] sm:px-5">
        <div className="flex items-center gap-3 sm:gap-5">
          <h1 className="shrink-0 text-sm font-semibold text-ink" id="deadline-summary-heading">마감 일정({deadlineItems.length})</h1>
          <div className="h-7 w-px shrink-0 bg-line" aria-hidden="true" />

          {deadlineItems.length > 0 ? (
            <>
              <button
                aria-label="이전 마감 일정"
                className="shrink-0 rounded-lg px-1.5 py-1 text-xl leading-none text-ink hover:bg-accent-soft disabled:cursor-default disabled:opacity-30"
                disabled={activeSlide === 0}
                onClick={() => setSlideIndex(activeSlide - 1)}
                type="button"
              >
                ‹
              </button>
              <div
                aria-label="마감 일정 슬라이드"
                className="min-w-0 flex-1 cursor-grab overflow-hidden select-none touch-pan-y active:cursor-grabbing"
                onPointerCancel={() => { pointerStartX.current = null }}
                onPointerDown={(event) => {
                  pointerStartX.current = event.clientX
                  event.currentTarget.setPointerCapture(event.pointerId)
                }}
                onPointerUp={(event) => handleSwipeEnd(event.clientX)}
              >
                <div
                  className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {deadlineItems.map((todo, index) => (
                    <div
                      aria-hidden={index !== activeSlide}
                      className="flex w-full shrink-0 items-center justify-between gap-3"
                      key={todo.id}
                    >
                      <span className="truncate text-sm font-medium text-ink">{todo.title}</span>
                      <span className="shrink-0 text-base font-bold text-accent">
                        {dDayLabel(todo.dueDate!)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                aria-label="다음 마감 일정"
                className="shrink-0 rounded-lg px-1.5 py-1 text-xl leading-none text-ink hover:bg-accent-soft disabled:cursor-default disabled:opacity-30"
                disabled={activeSlide === deadlineItems.length - 1}
                onClick={() => setSlideIndex(activeSlide + 1)}
                type="button"
              >
                ›
              </button>
              <span aria-live="polite" className="hidden shrink-0 text-xs text-muted sm:inline">
                {activeSlide + 1}/{deadlineItems.length}
              </span>
            </>
          ) : (
            <p className="min-w-0 flex-1 text-sm text-muted">예정된 마감 일정이 없어요.</p>
          )}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <section aria-labelledby="todo-list-heading">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 pb-4">
            <h2 className="shrink-0 text-lg font-semibold tracking-[-0.04em] text-ink sm:text-xl" id="todo-list-heading">Todo 목록</h2>
            <label className="flex items-center gap-1 justify-self-center text-xs font-medium text-ink sm:gap-2 sm:text-sm" htmlFor="todo-sort">
              정렬
              <select
                className="rounded-lg bg-white px-2 py-1.5 text-xs text-ink sm:px-3 sm:py-2 sm:text-sm"
                id="todo-sort"
                onChange={(event) => setSortBy(event.target.value as SortBy)}
                value={sortBy}
              >
                <option value="deadline">마감일순</option>
                <option value="name">이름순</option>
              </select>
            </label>
            <Link
              aria-label="Todo 추가"
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-2xl leading-none text-ink transition hover:border-accent hover:bg-accent-soft"
              to="/todos/new"
            >
              +
            </Link>
          </div>

          <ul className="mt-5 space-y-3">
            {visibleTodos.map((todo) => {
              const progress = getProgress(todo)
              const isExpanded = expandedTodoIds.includes(todo.id)

              return (
                <li className={`overflow-hidden rounded-2xl transition-colors hover:bg-accent-soft/40 ${todo.isCompleted ? 'bg-surface-muted/70' : 'bg-white'}`} key={todo.id}>
                  <div className="relative">
                    <Link
                      aria-label={`${todo.title} 상세 페이지 보기`}
                      className="absolute inset-0 z-10 focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                      to={`/todos/${todo.id}`}
                    />
                    <div className="px-5 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <p className={`min-w-0 font-medium ${todo.isCompleted ? 'text-muted line-through' : 'text-ink'}`}>{todo.title}</p>
                        {todo.dueDate ? (
                          <time className="shrink-0 text-right text-base font-bold text-accent" dateTime={todo.dueDate}>
                            {dDayLabel(todo.dueDate)}
                          </time>
                        ) : (
                          <span className="shrink-0 text-right text-xs text-muted">마감일 없음</span>
                        )}
                      </div>

                      <div className="mt-4 w-full">
                        <p className="text-xs text-muted">하위 체크리스트 {progress.completed}/{progress.total} 완료</p>
                        <div
                          aria-label={`${todo.title} 진행률`}
                          aria-valuemax={100}
                          aria-valuemin={0}
                          aria-valuenow={progress.percent}
                          className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-line"
                          role="progressbar"
                        >
                          <div className="h-full rounded-full bg-accent" style={{ width: `${progress.percent}%` }} />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                        <Link
                          className="relative z-20 inline-flex min-w-0 max-w-[60%] rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-accent hover:bg-accent-soft"
                          to={`/repositories/${todo.id}`}
                        >
                          <span className="truncate">{todo.repository?.name ?? '레포 연결 전'}</span>
                        </Link>
                        <div className="relative z-20 flex items-center gap-1">
                          <button
                            aria-pressed={todo.isCompleted}
                            className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink hover:border-accent hover:bg-accent-soft"
                            onClick={() => toggleTodoCompleted(todo.id)}
                            type="button"
                          >
                            {todo.isCompleted ? '완료 취소' : 'Todo 완료'}
                          </button>
                          <button
                            aria-controls={isExpanded ? `todo-checklist-${todo.id}` : undefined}
                            aria-expanded={isExpanded}
                            aria-label={`${todo.title} 하위 체크리스트 ${isExpanded ? '접기' : '펼치기'}`}
                            className="flex size-8 items-center justify-center rounded-lg text-2xl leading-none text-ink hover:bg-accent-soft"
                            onClick={() => toggleExpanded(todo.id)}
                            type="button"
                          >
                            <span aria-hidden="true" className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>⌄</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="bg-surface-muted/60 px-5 py-4" id={`todo-checklist-${todo.id}`}>
                      {todo.checklist.length > 0 ? (
                        <ol className="space-y-3">
                          {todo.checklist.map((item, index) => (
                            <li className="flex items-center gap-3 text-sm text-ink" key={item.id}>
                              <span className="w-5 shrink-0 text-right text-xs font-semibold text-muted">{index + 1}.</span>
                              <SewingButtonCheckbox
                                checked={item.completed}
                                id={`home-check-${todo.id}-${item.id}`}
                                itemIndex={index}
                                label={`${item.title} 완료`}
                                onChange={() => toggleChecklistItem(todo.id, item.id)}
                                size="small"
                                todoId={todo.id}
                              />
                              <label
                                className={`min-w-0 cursor-pointer ${item.completed ? 'text-muted line-through' : ''}`}
                                htmlFor={`home-check-${todo.id}-${item.id}`}
                              >
                                {item.title}
                              </label>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-sm text-muted">하위 체크리스트가 없어요.</p>
                      )}
                      <Link className="mt-4 inline-block text-xs font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-accent" to={`/todos/${todo.id}`}>
                        상세 화면 보기
                      </Link>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <aside className="self-start rounded-2xl bg-white p-5">
          <p className="text-sm font-semibold text-ink">작업 현황</p>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-muted p-3">
              <dt className="text-xs text-muted">전체</dt>
              <dd className="mt-1 text-2xl font-semibold text-ink">{todos.length}</dd>
            </div>
            <div className="rounded-xl bg-accent-soft p-3">
              <dt className="text-xs text-ink">진행 중</dt>
              <dd className="mt-1 text-2xl font-semibold text-ink">{remainingCount}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="text-sm font-semibold text-ink">GitHub 리포지터리 관리</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Todo별 리포지터리 연결 상태를 확인할 수 있어요.
            </p>
            <Link
              className="mt-4 block rounded-xl border border-line px-3 py-2.5 text-center text-sm font-medium text-ink transition hover:border-accent hover:bg-accent-soft"
              to="/repositories"
            >
              관리 화면 보기
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
