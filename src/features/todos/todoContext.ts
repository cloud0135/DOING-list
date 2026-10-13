import { createContext, useContext } from 'react'
import type { NewTodoInput, Repository, Todo, TodoChanges } from './todoData'

export type TodoContextValue = {
  todos: Todo[]
  addTodo: (input: NewTodoInput) => number
  updateTodo: (todoId: number, changes: TodoChanges) => void
  toggleChecklistItem: (todoId: number, itemId: string) => void
  setRepository: (todoId: number, repository: Repository | null) => void
}

export const TodoContext = createContext<TodoContextValue | null>(null)

export function useTodos() {
  const context = useContext(TodoContext)
  if (context === null) throw new Error('TodoProvider가 필요합니다.')
  return context
}
