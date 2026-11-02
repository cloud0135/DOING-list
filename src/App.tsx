import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppShell } from './components/AppShell'
import { StorageNotice } from './components/StorageNotice'
import { TodoProvider } from './features/todos/TodoProvider'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RepositoryDetailPage } from './pages/RepositoryDetailPage'
import { RepositoriesPage } from './pages/RepositoriesPage'
import { StatesPage } from './pages/StatesPage'
import { TodoDetailPage } from './pages/TodoDetailPage'
import { TodoCreatePage } from './pages/TodoCreatePage'

function App() {
  return (
    <BrowserRouter>
      <TodoProvider>
        <AppShell>
          <StorageNotice />
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<TodoCreatePage />} path="/todos/new" />
            <Route element={<TodoDetailPage />} path="/todos/:todoId" />
            <Route element={<LoginPage />} path="/login" />
            <Route element={<RepositoriesPage />} path="/repositories" />
            <Route element={<RepositoryDetailPage />} path="/repositories/:todoId" />
            <Route element={<StatesPage />} path="/states" />
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
        </AppShell>
      </TodoProvider>
    </BrowserRouter>
  )
}

export default App
