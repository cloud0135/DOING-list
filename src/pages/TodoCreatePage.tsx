import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTodos } from '../features/todos/todoContext'
import { previewRepositories } from '../features/todos/todoData'
import type { Repository } from '../features/todos/todoData'

type DraftItem = { key: number; title: string }

export function TodoCreatePage() {
  const { addTodo } = useTodos()
  const navigate = useNavigate()
  const nextItemKey = useRef(1)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [checklist, setChecklist] = useState<DraftItem[]>([])
  const [repository, setRepository] = useState<Repository | null>(null)
  const [isRepositoryPickerOpen, setIsRepositoryPickerOpen] = useState(false)
  const [titleError, setTitleError] = useState('')
  const [submitError, setSubmitError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedTitle = title.trim()

    if (!normalizedTitle) {
      setTitleError('프로젝트 이름을 입력해 주세요.')
      setSubmitError('')
      titleInputRef.current?.focus()
      return
    }

    setTitleError('')
    setSubmitError('')

    try {
      const id = addTodo({
        title: normalizedTitle,
        dueDate: dueDate || null,
        checklistTitles: checklist.map((item) => item.title.trim()).filter(Boolean),
        repository,
      })
      navigate(`/todos/${id}`)
    } catch {
      setSubmitError('Todo를 저장하지 못했어요. 다시 시도해 주세요.')
    }
  }

  function addChecklistRow() {
    setChecklist((current) => [...current, { key: nextItemKey.current++, title: '' }])
  }

  return (
    <div className="mx-auto max-w-3xl py-8 lg:py-12">
      <Link className="text-sm font-medium text-muted hover:text-ink" to="/">‹ Todo 목록</Link>
      <h1 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-ink sm:text-3xl">Todo 추가</h1>

      <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
        <section className="rounded-2xl bg-white p-5 sm:p-6">
          <label className="block text-sm font-semibold text-ink" htmlFor="new-todo-title">프로젝트 이름</label>
          <input
            aria-describedby={titleError ? 'new-todo-title-error' : undefined}
            aria-invalid={Boolean(titleError)}
            autoFocus
            className="mt-2 w-full rounded-xl bg-surface-muted px-4 py-3 text-base text-ink outline-accent"
            id="new-todo-title"
            onChange={(event) => {
              setTitle(event.target.value)
              setTitleError('')
              setSubmitError('')
            }}
            placeholder="예: 개인 프로젝트"
            ref={titleInputRef}
            required
            type="text"
            value={title}
          />
          {titleError && (
            <p className="mt-2 text-sm font-medium text-accent" id="new-todo-title-error" role="alert">
              {titleError}
            </p>
          )}

          {!repository && (
            <button
              aria-expanded={isRepositoryPickerOpen}
              className="mt-4 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft"
              onClick={() => setIsRepositoryPickerOpen((current) => !current)}
              type="button"
            >
              레포 연결 전
            </button>
          )}

          {!repository && isRepositoryPickerOpen && (
            <div className="mt-4 rounded-xl bg-surface-muted p-4">
              <p className="text-sm font-semibold text-ink">리포지터리 선택</p>
              <div className="mt-3 grid gap-2">
                {previewRepositories.map((item) => (
                  <button
                    className="rounded-lg border border-line bg-white px-3 py-2 text-left text-sm text-ink hover:border-accent hover:bg-accent-soft"
                    key={item.id}
                    onClick={() => {
                      setRepository(item)
                      setIsRepositoryPickerOpen(false)
                    }}
                    type="button"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="mt-6 block text-sm font-semibold text-ink" htmlFor="new-todo-due-date">마감일</label>
          <input
            className="mt-2 rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink outline-accent"
            id="new-todo-due-date"
            onChange={(event) => setDueDate(event.target.value)}
            type="date"
            value={dueDate}
          />
          <p className="mt-2 text-xs text-muted">마감일은 선택 항목이에요.</p>
        </section>

        <section className="rounded-2xl bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-ink">하위 체크리스트</h2>
          {checklist.length > 0 && (
            <ol className="mt-4 space-y-3">
              {checklist.map((item, index) => (
                <li className="flex items-center gap-3" key={item.key}>
                  <span className="w-5 shrink-0 text-right text-xs font-semibold text-muted">{index + 1}.</span>
                  <label className="sr-only" htmlFor={`new-checklist-${item.key}`}>하위 항목 {index + 1}</label>
                  <input
                    className="min-w-0 flex-1 rounded-lg bg-surface-muted px-3 py-2 text-sm text-ink outline-accent"
                    id={`new-checklist-${item.key}`}
                    onChange={(event) => setChecklist((current) => current.map((entry) => (
                      entry.key === item.key ? { ...entry, title: event.target.value } : entry
                    )))}
                    placeholder="할 일 입력"
                    type="text"
                    value={item.title}
                  />
                  <button
                    aria-label={`하위 항목 ${index + 1} 삭제`}
                    className="shrink-0 rounded-lg px-2 py-2 text-xs font-medium text-muted hover:bg-accent-soft hover:text-ink"
                    onClick={() => setChecklist((current) => current.filter((entry) => entry.key !== item.key))}
                    type="button"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ol>
          )}
          <button className="mt-4 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink hover:border-accent hover:bg-accent-soft" onClick={addChecklistRow} type="button">
            + 하위 항목 추가
          </button>
        </section>

        {repository && (
          <section className="rounded-2xl bg-white p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-ink">연결된 리포지터리</h2>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium text-ink">{repository.name}</p>
              <button
                className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink hover:border-accent hover:bg-accent-soft"
                onClick={() => {
                  setRepository(null)
                  setIsRepositoryPickerOpen(true)
                }}
                type="button"
              >
                연결 변경
              </button>
            </div>
          </section>
        )}

        {submitError && (
          <p className="text-sm font-medium text-accent" role="alert">{submitError}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Link className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink hover:bg-accent-soft" to="/">취소</Link>
          <button className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-accent" type="submit">Todo 추가 완료</button>
        </div>
      </form>
    </div>
  )
}
