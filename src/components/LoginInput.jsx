import useInput from '../hooks/useInput'

function LoginInput({ login }) {
  const [email, handleEmailChange] = useInput('')
  const [password, handlePasswordChange] = useInput('')

  function handleSubmit(event) {
    event.preventDefault()
    login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form-body">
      <div className="form-group">
        <label htmlFor="login-email" className="form-label">
          Email
        </label>
        <div className="input-with-icon">
          <svg className="input-icon" viewBox="0 0 24 24">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" strokeWidth="2" />
            <polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            id="login-email"
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
        <label htmlFor="login-password" className="form-label">
          Password
        </label>
        <div className="input-with-icon">
          <svg className="input-icon" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            id="login-password"
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

      <button type="submit" className="btn-auth-submit" id="btn-login">
        Sign In
      </button>
    </form>
  )
}

export default LoginInput
