import { useState } from 'react'
import type { ReactNode } from 'react'
import { TodoContext } from './todoContext'
import { initialTodos } from './todoData'
import type { NewTodoInput, Repository, TodoChanges } from './todoData'

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState(initialTodos)

  function addTodo(input: NewTodoInput) {
    const id = crypto.randomUUID()
    const timestamp = new Date().toISOString()
    const checklist = input.checklistTitles.filter((title) => title.trim()).map((title) => ({
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
    }))
    setTodos((current) => [...current, {
      id,
      title: input.title.trim(),
      isCompleted: false,
      dueDate: input.dueDate,
      createdAt: timestamp,
      updatedAt: timestamp,
      checklist,
      repository: input.repository,
    }])
    return id
  }

  function updateTodo(todoId: string, changes: TodoChanges) {
    setTodos((current) => current.map((todo) => (
      todo.id === todoId
        ? {
            ...todo,
            title: changes.title.trim(),
            dueDate: changes.dueDate,
            checklist: changes.checklist.map((item) => ({ ...item, title: item.title.trim() })),
            updatedAt: new Date().toISOString(),
          }
        : todo
    )))
  }

  function toggleChecklistItem(todoId: string, itemId: string) {
    setTodos((current) => current.map((todo) => (
      todo.id === todoId
        ? {
            ...todo,
            checklist: todo.checklist.map((item) => (
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )),
            updatedAt: new Date().toISOString(),
          }
        : todo
    )))
  }

  function setRepository(todoId: string, repository: Repository | null) {
    setTodos((current) => current.map((todo) => (
      todo.id === todoId ? { ...todo, repository, updatedAt: new Date().toISOString() } : todo
    )))
  }

  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, toggleChecklistItem, setRepository }}>
      {children}
    </TodoContext.Provider>
  )
}
