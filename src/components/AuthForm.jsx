import { useState } from 'react'
import { FaEnvelope, FaLock, FaGift, FaStar, FaTrophy, FaRocket } from 'react-icons/fa'
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

  // User-friendly error messages
  const getErrorMessage = (err) => {
    const msg = err?.message?.toLowerCase() || ''
    
    if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
      return "We couldn't find an account with those details. Double-check your email and password, or sign up to get started!"
    }
    if (msg.includes('user not found') || msg.includes('no user')) {
      return "Looks like you're new here! Create an account to start earning rewards."
    }
    if (msg.includes('email not confirmed')) {
      return "Almost there! Please check your inbox and confirm your email to continue."
    }
    if (msg.includes('invalid email')) {
      return "Please enter a valid email address."
    }
    if (msg.includes('weak password') || msg.includes('password')) {
      return "Your password needs to be at least 6 characters. Make it strong!"
    }
    if (msg.includes('already registered') || msg.includes('already exists')) {
      return "This email is already registered. Try signing in instead!"
    }
    if (msg.includes('rate limit') || msg.includes('too many')) {
      return "Whoa, slow down! Too many attempts. Please wait a moment and try again."
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return "Connection issue. Please check your internet and try again."
    }
    
    return err?.message || 'Something went wrong. Please try again.'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please try again.')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters for security.')
          setLoading(false)
          return
        }

        const { error: signUpError } = await signUp(email, password)
        if (signUpError) throw signUpError
        setMessage('🎉 Welcome aboard! Check your email to confirm your account, then sign in to start earning.')
      } else {
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="FlowvaHub" className="brand-logo" />
          <h1>{isSignUp ? 'Join Flowva Rewards' : 'Welcome Back!'}</h1>
          <p>{isSignUp 
            ? 'Start earning points for every win. Redeem for real rewards.' 
            : 'Sign in to continue earning and redeeming your points.'
          }</p>
        </div>

        {/* Benefits showcase for sign up */}
        {isSignUp && (
          <div className="auth-benefits">
            <div className="benefit-item">
              <FaGift className="benefit-icon" />
              <span>Earn points daily</span>
            </div>
            <div className="benefit-item">
              <FaTrophy className="benefit-icon" />
              <span>Build streaks</span>
            </div>
            <div className="benefit-item">
              <FaStar className="benefit-icon" />
              <span>Redeem rewards</span>
            </div>
          </div>
        )}

        {!hasSupabaseConfig && (
          <div className="info-message" style={{ marginBottom: 12 }}>
            <FaRocket style={{ marginRight: 6 }} />
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
              placeholder="you@example.com"
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
              placeholder={isSignUp ? 'Create a secure password' : 'Enter your password'}
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
