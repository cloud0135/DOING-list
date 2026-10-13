import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { TodoContext } from './todoContext'
import { initialTodos } from './todoData'
import type { NewTodoInput, Repository, TodoChanges } from './todoData'

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState(initialTodos)
  const nextTodoId = useRef(Math.max(...initialTodos.map((todo) => todo.id)) + 1)
  const nextChecklistItemId = useRef(1)

  function addTodo(input: NewTodoInput) {
    const id = nextTodoId.current++
    const checklist = input.checklistTitles.filter((title) => title.trim()).map((title) => ({
      id: `${id}-item-${nextChecklistItemId.current++}`,
      title: title.trim(),
      completed: false,
    }))
    setTodos((current) => [...current, {
      id,
      title: input.title.trim(),
      dueDate: input.dueDate,
      checklist,
      repository: input.repository,
    }])
    return id
  }

  function updateTodo(todoId: number, changes: TodoChanges) {
    setTodos((current) => current.map((todo) => (
      todo.id === todoId
        ? {
            ...todo,
            title: changes.title.trim(),
            dueDate: changes.dueDate,
            checklist: changes.checklist.map((item) => ({ ...item, title: item.title.trim() })),
          }
        : todo
    )))
  }

  function toggleChecklistItem(todoId: number, itemId: string) {
    setTodos((current) => current.map((todo) => (
      todo.id === todoId
        ? {
            ...todo,
            checklist: todo.checklist.map((item) => (
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )),
          }
        : todo
    )))
  }

  function setRepository(todoId: number, repository: Repository | null) {
    setTodos((current) => current.map((todo) => (
      todo.id === todoId ? { ...todo, repository } : todo
    )))
  }

  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, toggleChecklistItem, setRepository }}>
      {children}
    </TodoContext.Provider>
  )
}
