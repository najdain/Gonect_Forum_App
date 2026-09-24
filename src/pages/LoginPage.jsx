import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { asyncSetAuthUser } from '../states/authUser/action'
import LoginInput from '../components/LoginInput'
import talkImg from '../assets/img/talk.jpg'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function onLogin({ email, password }) {
    try {
      await dispatch(asyncSetAuthUser({ email, password }))
      navigate('/')
    } catch (error) {
    }
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
            Happening now.
          </h1>
          <p className="auth-hero-subtext">
            Join the conversation, share ideas, and connect with developers worldwide.
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

      {/* Right Form Pane */}
      <div className="auth-form-pane">
        <div className="auth-form-card">
          
          <div className="auth-form-header">
            <div className="auth-mobile-logo">
              <svg viewBox="0 0 24 24" style={{ width: '36px', height: '36px', fill: 'var(--color-primary)' }}>
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <h2>Sign in to GoNect</h2>
            <p>Welcome back! Please enter your account credentials.</p>
          </div>

          <LoginInput login={onLogin} />

          <footer className="auth-form-footer">
            <span>Don&apos;t have an account?</span>{' '}
            <Link to="/register" id="link-register" className="auth-link">
              Sign Up
            </Link>
          </footer>

        </div>
      </div>

    </div>
  )
}

export default LoginPage
