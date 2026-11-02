import { useEffect, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import { TodoContext } from './todoContext'
import { initialTodos } from './todoData'
import type { NewTodoInput, Repository, TodoChanges } from './todoData'
import { todoReducer } from './todoReducer'
import {
  TODO_STORAGE_KEY,
  backupInvalidTodos,
  loadTodos,
  parseStoredTodos,
  saveTodos,
} from './todoStorage'
import type { TodoStorageWarning } from './todoStorage'

function storageWarningReducer(
  _currentWarning: TodoStorageWarning | null,
  nextWarning: TodoStorageWarning,
) {
  return nextWarning
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [initialStorage] = useState(() => loadTodos(initialTodos))
  const [todos, dispatch] = useReducer(todoReducer, initialStorage.todos)
  const [storageWarning, reportStorageWarning] = useReducer(storageWarningReducer, initialStorage.warning)

  useEffect(() => {
    if (!initialStorage.persistOnLoad && todos === initialStorage.todos) return
    if (!saveTodos(todos)) reportStorageWarning('unavailable')
  }, [initialStorage, todos])

  useEffect(() => {
    function syncTodos(event: StorageEvent) {
      if (event.key !== TODO_STORAGE_KEY || event.newValue === null) return

      const parsedStorage = parseStoredTodos(event.newValue)
      if (!parsedStorage) {
        reportStorageWarning(backupInvalidTodos(event.newValue) ? 'recovered' : 'unavailable')
        return
      }

      dispatch({ type: 'todos/replaced', todos: parsedStorage.todos })
    }

    window.addEventListener('storage', syncTodos)
    return () => window.removeEventListener('storage', syncTodos)
  }, [])

  function addTodo(input: NewTodoInput) {
    const title = input.title.trim()
    if (!title) throw new Error('Todo title is required.')

    const id = crypto.randomUUID()
    const timestamp = new Date().toISOString()
    const checklist = input.checklistTitles.filter((checklistTitle) => checklistTitle.trim()).map((checklistTitle) => ({
      id: crypto.randomUUID(),
      title: checklistTitle.trim(),
      completed: false,
    }))
    dispatch({ type: 'todo/added', todo: {
      id,
      title,
      isCompleted: false,
      dueDate: input.dueDate,
      createdAt: timestamp,
      updatedAt: timestamp,
      checklist,
      repository: input.repository,
    } })
    return id
  }

  function updateTodo(todoId: string, changes: TodoChanges) {
    const title = changes.title.trim()
    const checklist = changes.checklist.map((item) => ({ ...item, title: item.title.trim() }))
    if (!title || checklist.some((item) => !item.title)) {
      throw new Error('Todo and checklist titles are required.')
    }

    dispatch({
      type: 'todo/updated',
      todoId,
      changes: {
        title,
        dueDate: changes.dueDate,
        checklist,
      },
      updatedAt: new Date().toISOString(),
    })
  }

  function deleteTodo(todoId: string) {
    dispatch({ type: 'todo/deleted', todoId })
  }

  function toggleTodoCompleted(todoId: string) {
    dispatch({ type: 'todo/completionToggled', todoId, updatedAt: new Date().toISOString() })
  }

  function toggleChecklistItem(todoId: string, itemId: string) {
    dispatch({ type: 'checklist/itemToggled', todoId, itemId, updatedAt: new Date().toISOString() })
  }

  function setRepository(todoId: string, repository: Repository | null) {
    dispatch({ type: 'repository/set', todoId, repository, updatedAt: new Date().toISOString() })
  }

  return (
    <TodoContext.Provider value={{
      todos,
      storageWarning,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodoCompleted,
      toggleChecklistItem,
      setRepository,
    }}>
      {children}
    </TodoContext.Provider>
  )
}
