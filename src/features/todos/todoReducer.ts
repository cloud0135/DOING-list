import type { Repository, Todo, TodoChanges } from './todoData'

export type TodoAction =
  | { type: 'todos/replaced'; todos: Todo[] }
  | { type: 'todo/added'; todo: Todo }
  | { type: 'todo/updated'; todoId: string; changes: TodoChanges; updatedAt: string }
  | { type: 'todo/deleted'; todoId: string }
  | { type: 'todo/completionToggled'; todoId: string; updatedAt: string }
  | { type: 'checklist/itemToggled'; todoId: string; itemId: string; updatedAt: string }
  | { type: 'repository/set'; todoId: string; repository: Repository | null; updatedAt: string }

function updateTodoById(todos: Todo[], todoId: string, update: (todo: Todo) => Todo) {
  let todoChanged = false
  const nextTodos = todos.map((todo) => {
    if (todo.id !== todoId) return todo
    const nextTodo = update(todo)
    if (nextTodo !== todo) todoChanged = true
    return nextTodo
  })

  return todoChanged ? nextTodos : todos
}

export function todoReducer(todos: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'todos/replaced':
      return action.todos

    case 'todo/added':
      return [...todos, action.todo]

    case 'todo/updated':
      return updateTodoById(todos, action.todoId, (todo) => ({
        ...todo,
        ...action.changes,
        updatedAt: action.updatedAt,
      }))

    case 'todo/deleted': {
      const nextTodos = todos.filter((todo) => todo.id !== action.todoId)
      return nextTodos.length === todos.length ? todos : nextTodos
    }

    case 'todo/completionToggled':
      return updateTodoById(todos, action.todoId, (todo) => ({
        ...todo,
        isCompleted: !todo.isCompleted,
        updatedAt: action.updatedAt,
      }))

    case 'checklist/itemToggled':
      return updateTodoById(todos, action.todoId, (todo) => {
        const itemExists = todo.checklist.some((item) => item.id === action.itemId)
        if (!itemExists) return todo

        return {
          ...todo,
          checklist: todo.checklist.map((item) => (
            item.id === action.itemId ? { ...item, completed: !item.completed } : item
          )),
          updatedAt: action.updatedAt,
        }
      })

    case 'repository/set':
      return updateTodoById(todos, action.todoId, (todo) => ({
        ...todo,
        repository: action.repository,
        updatedAt: action.updatedAt,
      }))
  }
}
