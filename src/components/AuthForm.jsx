import { useState } from 'react'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import './AuthForm.css'
import logo from '../assets/flowvahub-logo.png'

function AuthForm() {
  const { signIn, signUp, hasSupabaseConfig } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }

        const { error: signUpError } = await signUp(email, password)
        if (signUpError) throw signUpError
        setMessage('Check your email to confirm your account, then sign in.')
      } else {
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="FlowvaHub" className="brand-logo" />
          <h1>Flowva Rewards</h1>
          <p>Sign in to earn and redeem points</p>
        </div>

        {!hasSupabaseConfig && (
          <div className="info-message" style={{ marginBottom: 12 }}>
            Supabase is not configured. Add VITE_SUPABASE_URL and
            VITE_SUPABASE_ANON_KEY to .env and restart the dev server.
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope size={14} /> Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock size={14} /> Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FaLock size={14} /> Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {message && <div className="info-message">{message}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setMessage('')
              }}
              className="toggle-button"
              disabled={loading}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>

      <div className="auth-background">
        <div className="gradient-circle gradient-1"></div>
        <div className="gradient-circle gradient-2"></div>
        <div className="gradient-circle gradient-3"></div>
      </div>
    </div>
  )
}

export default AuthForm
