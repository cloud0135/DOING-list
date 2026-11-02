import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SewingButtonCheckbox } from '../components/SewingButtonCheckbox'
import { TrashIcon } from '../components/TrashIcon'
import { useTodos } from '../features/todos/todoContext'
import { dDayLabel, getProgress, previewRepositories } from '../features/todos/todoData'
import type { ChecklistItem, TodoChanges } from '../features/todos/todoData'
import { NotFoundPage } from './NotFoundPage'

type EditDraft = TodoChanges & { todoId: string }

export function TodoDetailPage() {
  const { todoId } = useParams()
  const navigate = useNavigate()
  const { todos, updateTodo, deleteTodo, toggleTodoCompleted, toggleChecklistItem, setRepository } = useTodos()
  const [draft, setDraft] = useState<EditDraft | null>(null)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [editError, setEditError] = useState('')
  const [isRepositoryPickerOpen, setIsRepositoryPickerOpen] = useState(false)
  const foundTodo = todos.find((item) => item.id === todoId)

  if (!foundTodo) return <NotFoundPage />

  const todo = foundTodo
  const activeDraft = draft?.todoId === todo.id ? draft : null
  const visibleTodo = activeDraft ? { ...todo, ...activeDraft } : todo
  const progress = getProgress(visibleTodo)

  function updateDraft(changes: Partial<TodoChanges>) {
    setDraft((current) => current?.todoId === todo.id ? { ...current, ...changes } : current)
    setEditError('')
  }

  function updateDraftItem(itemId: string, changes: Partial<ChecklistItem>) {
    setDraft((current) => current?.todoId === todo.id ? {
      ...current,
      checklist: current.checklist.map((item) => item.id === itemId ? { ...item, ...changes } : item),
    } : current)
    setEditError('')
  }

  function handleAddChecklistItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newItemTitle.trim() || !activeDraft) return
    updateDraft({ checklist: [...activeDraft.checklist, { id: crypto.randomUUID(), title: newItemTitle.trim(), completed: false }] })
    setNewItemTitle('')
  }

  function handleEditButton() {
    if (!activeDraft) {
      setDraft({
        todoId: todo.id,
        title: todo.title,
        dueDate: todo.dueDate,
        checklist: todo.checklist.map((item) => ({ ...item })),
      })
      setEditError('')
      return
    }

    if (!activeDraft.title.trim() || activeDraft.checklist.some((item) => !item.title.trim())) {
      setEditError('제목과 하위 항목을 모두 입력해 주세요.')
      return
    }

    try {
      updateTodo(todo.id, {
        title: activeDraft.title,
        dueDate: activeDraft.dueDate,
        checklist: newItemTitle.trim()
          ? [...activeDraft.checklist, { id: crypto.randomUUID(), title: newItemTitle.trim(), completed: false }]
          : activeDraft.checklist,
      })
      setNewItemTitle('')
      setDraft(null)
      setEditError('')
    } catch {
      setEditError('Todo 수정을 저장하지 못했어요. 다시 시도해 주세요.')
    }
  }

  function handleDelete() {
    const confirmed = window.confirm(`“${todo.title}” Todo를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)
    if (!confirmed) return

    deleteTodo(todo.id)
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-3xl py-8 lg:py-12">
      <Link className="text-sm font-medium text-muted hover:text-ink" to="/">‹ Todo 목록</Link>

      <header className="mt-8">
        <p className="text-sm font-medium text-muted">하위 체크리스트</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          {activeDraft ? (
            <label className="min-w-0 flex-1">
              <span className="sr-only">Todo 제목</span>
              <input
                className="w-full rounded-xl bg-white px-3 py-2 text-2xl font-semibold tracking-[-0.04em] text-ink outline-accent sm:text-3xl"
                onChange={(event) => updateDraft({ title: event.target.value })}
                type="text"
                value={activeDraft.title}
              />
            </label>
          ) : (
            <h1 className="min-w-0 flex-1 text-2xl font-semibold tracking-[-0.04em] text-ink sm:text-3xl">{todo.title}</h1>
          )}
          {activeDraft ? (
            <label className="text-xs font-medium text-muted">
              마감일
              <input
                className="mt-1 block rounded-lg bg-white px-3 py-2 text-sm text-ink outline-accent"
                onChange={(event) => updateDraft({ dueDate: event.target.value || null })}
                type="date"
                value={activeDraft.dueDate ?? ''}
              />
            </label>
          ) : todo.dueDate ? (
            <time className="text-lg font-bold text-accent" dateTime={todo.dueDate}>{dDayLabel(todo.dueDate)}</time>
          ) : null}
        </div>
      </header>

      <section
        aria-labelledby="checklist-heading"
        className={`mt-6 rounded-2xl p-5 sm:p-6 ${activeDraft ? 'bg-canvas' : 'bg-white'}`}
      >
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-ink" id="checklist-heading">체크리스트</h2>
          <p className="text-sm font-medium text-muted">{progress.completed}/{progress.total} 완료</p>
        </div>
        <div
          aria-label={`${visibleTodo.title} 진행률`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress.percent}
          className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
        >
          <div className="h-full rounded-full bg-accent transition-[width] motion-reduce:transition-none" style={{ width: `${progress.percent}%` }} />
        </div>

        <ol className="mt-6">
          {visibleTodo.checklist.map((item, index) => (
            <li className="flex items-center gap-3 py-4" key={item.id}>
              <span className="w-5 shrink-0 text-right text-xs font-semibold text-muted">{index + 1}.</span>
              <SewingButtonCheckbox
                checked={item.completed}
                id={`check-item-${item.id}`}
                itemIndex={index}
                label={`${item.title || `하위 항목 ${index + 1}`} 완료`}
                onChange={() => activeDraft
                  ? updateDraftItem(item.id, { completed: !item.completed })
                  : toggleChecklistItem(todo.id, item.id)}
                todoId={todo.id}
              />
              {activeDraft ? (
                <>
                  <label className="sr-only" htmlFor={`edit-item-${item.id}`}>하위 항목 {index + 1}</label>
                  <input
                    className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 text-sm text-ink outline-accent"
                    id={`edit-item-${item.id}`}
                    onChange={(event) => updateDraftItem(item.id, { title: event.target.value })}
                    type="text"
                    value={item.title}
                  />
                  <button
                    aria-label={`${item.title || `하위 항목 ${index + 1}`} 삭제`}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-accent-soft hover:text-ink"
                    onClick={() => updateDraft({ checklist: activeDraft.checklist.filter((entry) => entry.id !== item.id) })}
                    type="button"
                  >
                    <TrashIcon />
                  </button>
                </>
              ) : (
                <label className={`min-w-0 flex-1 cursor-pointer text-sm ${item.completed ? 'text-muted line-through' : 'text-ink'}`} htmlFor={`check-item-${item.id}`}>
                  {item.title}
                </label>
              )}
            </li>
          ))}
        </ol>
        {visibleTodo.checklist.length === 0 && (
          <p className="py-4 text-sm text-muted">하위 체크리스트가 없어요.</p>
        )}

        {activeDraft && (
          <form className="flex flex-wrap gap-2 pt-4" onSubmit={handleAddChecklistItem}>
            <label className="sr-only" htmlFor="new-checklist-item">하위 체크리스트 항목</label>
            <input
              className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 text-sm text-ink outline-accent"
              id="new-checklist-item"
              onChange={(event) => setNewItemTitle(event.target.value)}
              placeholder="하위 항목 추가"
              required
              type="text"
              value={newItemTitle}
            />
            <button className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft" type="submit">추가</button>
          </form>
        )}
      </section>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          {todo.repository ? (
            <Link
              className="inline-flex rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft"
              to={`/repositories/${todo.id}`}
            >
              {todo.repository.name}
            </Link>
          ) : (
            <button
              aria-expanded={isRepositoryPickerOpen}
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft"
              onClick={() => setIsRepositoryPickerOpen((current) => !current)}
              type="button"
            >
              레포 연결 전
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeDraft && (
            <button
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-accent-soft hover:text-ink"
              onClick={() => {
                setDraft(null)
                setNewItemTitle('')
                setEditError('')
              }}
              type="button"
            >
              취소
            </button>
          )}
          <button
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft"
            onClick={handleEditButton}
            type="button"
          >
            {activeDraft ? '수정 완료' : '수정'}
          </button>
        </div>
      </div>
      {!todo.repository && isRepositoryPickerOpen && (
        <div className="mt-4 rounded-xl bg-white p-4">
          <p className="text-sm font-semibold text-ink">리포지터리 선택</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {previewRepositories.map((repository) => (
              <button
                className="rounded-lg border border-line px-3 py-2 text-left text-sm text-ink hover:border-accent hover:bg-accent-soft"
                key={repository.id}
                onClick={() => {
                  setRepository(todo.id, repository)
                  setIsRepositoryPickerOpen(false)
                }}
                type="button"
              >
                {repository.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {editError && <p className="mt-3 text-sm font-medium text-accent" role="alert">{editError}</p>}
      {!activeDraft && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <button
            className="rounded-lg px-3 py-2 text-sm font-medium text-accent hover:bg-accent-soft"
            onClick={handleDelete}
            type="button"
          >
            Todo 삭제
          </button>
          <button
            aria-pressed={todo.isCompleted}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${todo.isCompleted ? 'border border-line bg-white text-ink hover:bg-accent-soft' : 'bg-ink text-white hover:bg-accent'}`}
            onClick={() => toggleTodoCompleted(todo.id)}
            type="button"
          >
            {todo.isCompleted ? '완료 취소' : 'Todo 완료'}
          </button>
        </div>
      )}
    </div>
  )
}
