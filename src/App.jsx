import './App.css'
import AuthForm from './components/AuthForm'
import RewardPage from './components/RewardPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppShell() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" aria-label="Loading" />
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <RewardPage />
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
