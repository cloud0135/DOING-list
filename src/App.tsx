import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RepositoriesPage } from './pages/RepositoriesPage'
import { StatesPage } from './pages/StatesPage'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RepositoriesPage />} path="/repositories" />
          <Route element={<StatesPage />} path="/states" />
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
