import type { ChecklistItem, Repository, Todo } from './todoData'

export const TODO_STORAGE_KEY = 'doing-list:todos'
export const TODO_STORAGE_RECOVERY_KEY = 'doing-list:todos:recovery'
export const TODO_STORAGE_VERSION = 1

export type TodoStorageWarning = 'recovered' | 'unavailable'

export type TodoStorageLoadResult = {
  todos: Todo[]
  warning: TodoStorageWarning | null
  persistOnLoad: boolean
}

export type ParsedTodoStorage = {
  todos: Todo[]
  migrated: boolean
}

type TodoStorageState = {
  version: typeof TODO_STORAGE_VERSION
  todos: Todo[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isChecklistItem(value: unknown): value is ChecklistItem {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.title === 'string'
    && typeof value.completed === 'boolean'
}

function isRepository(value: unknown): value is Repository {
  return isRecord(value)
    && typeof value.id === 'number'
    && typeof value.name === 'string'
    && typeof value.owner === 'string'
    && typeof value.description === 'string'
    && typeof value.language === 'string'
    && (value.url === null || typeof value.url === 'string')
    && typeof value.defaultBranch === 'string'
}

function isTodo(value: unknown): value is Todo {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.title === 'string'
    && typeof value.isCompleted === 'boolean'
    && (value.dueDate === null || typeof value.dueDate === 'string')
    && typeof value.createdAt === 'string'
    && typeof value.updatedAt === 'string'
    && Array.isArray(value.checklist)
    && value.checklist.every(isChecklistItem)
    && (value.repository === null || isRepository(value.repository))
}

function isTodoStorageState(value: unknown): value is TodoStorageState {
  return isRecord(value)
    && value.version === TODO_STORAGE_VERSION
    && Array.isArray(value.todos)
    && value.todos.every(isTodo)
}

function isLegacyTodoStorageState(value: unknown): value is { version: 0; todos: Todo[] } {
  return isRecord(value)
    && value.version === 0
    && Array.isArray(value.todos)
    && value.todos.every(isTodo)
}

export function parseStoredTodos(storedValue: string): ParsedTodoStorage | null {
  try {
    const parsedValue: unknown = JSON.parse(storedValue)
    if (isTodoStorageState(parsedValue)) {
      return { todos: parsedValue.todos, migrated: false }
    }
    if (isLegacyTodoStorageState(parsedValue)) {
      return { todos: parsedValue.todos, migrated: true }
    }
    if (Array.isArray(parsedValue) && parsedValue.every(isTodo)) {
      return { todos: parsedValue, migrated: true }
    }
    return null
  } catch {
    return null
  }
}

export function backupInvalidTodos(storedValue: string): boolean {
  try {
    window.localStorage.setItem(TODO_STORAGE_RECOVERY_KEY, storedValue)
    return true
  } catch {
    return false
  }
}

export function loadTodos(fallbackTodos: Todo[]): TodoStorageLoadResult {
  let storedValue: string | null

  try {
    storedValue = window.localStorage.getItem(TODO_STORAGE_KEY)
  } catch {
    return { todos: fallbackTodos, warning: 'unavailable', persistOnLoad: false }
  }

  if (storedValue === null) {
    return { todos: fallbackTodos, warning: null, persistOnLoad: true }
  }

  const parsedStorage = parseStoredTodos(storedValue)
  if (parsedStorage) {
    return {
      todos: parsedStorage.todos,
      warning: null,
      persistOnLoad: parsedStorage.migrated,
    }
  }

  const backedUp = backupInvalidTodos(storedValue)
  return {
    todos: fallbackTodos,
    warning: backedUp ? 'recovered' : 'unavailable',
    persistOnLoad: backedUp,
  }
}

export function saveTodos(todos: Todo[]): boolean {
  const storageState: TodoStorageState = {
    version: TODO_STORAGE_VERSION,
    todos,
  }

  try {
    window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(storageState))
    return true
  } catch {
    return false
  }
}
