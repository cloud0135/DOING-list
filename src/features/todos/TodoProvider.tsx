import { useReducer } from 'react'
import type { ReactNode } from 'react'
import { TodoContext } from './todoContext'
import { initialTodos } from './todoData'
import type { NewTodoInput, Repository, TodoChanges } from './todoData'
import { todoReducer } from './todoReducer'

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos)

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
