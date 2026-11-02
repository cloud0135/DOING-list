import type { ChecklistItem, Repository, Todo } from './todoData'

export const TODO_STORAGE_KEY = 'doing-list:todos'
export const TODO_STORAGE_VERSION = 1

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

export function loadTodos(fallbackTodos: Todo[]): Todo[] {
  try {
    const storedValue = window.localStorage.getItem(TODO_STORAGE_KEY)
    if (storedValue === null) return fallbackTodos

    const parsedValue: unknown = JSON.parse(storedValue)
    return isTodoStorageState(parsedValue) ? parsedValue.todos : fallbackTodos
  } catch {
    return fallbackTodos
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
