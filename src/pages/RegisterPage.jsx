import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import useInput from '../hooks/useInput'
import { asyncRegisterUser } from '../states/users/action'
import talkImg from '../assets/img/talk.jpg'

function RegisterPage() {
  const [name, handleNameChange] = useInput('')
  const [email, handleEmailChange] = useInput('')
  const [password, handlePasswordChange] = useInput('')
  const [isSuccess, setIsSuccess] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Handler submit registrasi akun
  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await dispatch(asyncRegisterUser({ name, email, password }))
      setIsSuccess(true)
    } catch (error) {
      // Errors handled inside thunk
    }
  }

  // Handler konfirmasi sukses registrasi
  function handleModalConfirm() {
    setIsSuccess(false)
    navigate('/login')
  }

  return (
    <div className="auth-fullscreen-container">
      <div 
        className="auth-hero-pane" 
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(20, 184, 166, 0.88), rgba(2, 132, 199, 0.90)), url(${talkImg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="auth-hero-content">
          <div className="auth-hero-logo">
            <svg viewBox="0 0 24 24" style={{ width: '48px', height: '48px', fill: '#ffffff' }}>
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <span style={{ fontSize: '32px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>GoNect</span>
          </div>

          <h1 className="auth-hero-headline">
            Join today.
          </h1>
          <p className="auth-hero-subtext">
            Create an account to start posting threads, giving feedback, and connecting with peers.
          </p>

          <div className="auth-hero-features">
            <div className="feature-item">
              <span className="feature-icon">&bull;</span>
              <span>Engage in real-time threads and discussions</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">&bull;</span>
              <span>Discover trending topics and hashtags</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">&bull;</span>
              <span>Build your reputation among top contributors</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-pane">
        <div className="auth-form-card">
          
          <div className="auth-form-header">
            <div className="auth-mobile-logo">
              <svg viewBox="0 0 24 24" style={{ width: '36px', height: '36px', fill: 'var(--color-primary)' }}>
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <h2>Create Your Account</h2>
            <p>Join the GoNect community today.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-body">
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">
                Full Name
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  id="reg-name"
                  type="text"
                  className="form-input auth-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">
                Email
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input auth-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">
                Password
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  id="reg-password"
                  type="password"
                  className="form-input auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-auth-submit" id="btn-register">
              Create Account
            </button>
          </form>

          <footer className="auth-form-footer">
            <span>Already have an account?</span>{' '}
            <Link to="/login" id="link-login" className="auth-link">
              Sign In
            </Link>
          </footer>

        </div>
      </div>

      {isSuccess && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <svg viewBox="0 0 24 24" style={{ width: '32px', height: '32px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Account Created!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              Your account has been created successfully. Please log in to start using GoNect.
            </p>
            <button
              onClick={handleModalConfirm}
              className="btn-auth-submit"
              id="modal-ok-btn"
            >
              OK, Go to Login
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default RegisterPage
