import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useNotification } from '../context/NotificationContext'

function Navigation({ authUser, signOut }) {
  const navigate = useNavigate()
  const { showAuthModal } = useNotification() || {}

  const displayAvatar = authUser ? (() => {
    try {
      const saved = localStorage.getItem(`gonect_profile_${authUser.id}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.avatar) return parsed.avatar
      }
    } catch (e) {
      // ignore
    }
    return authUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.name)}`
  })() : ''

  const displayName = authUser ? (() => {
    try {
      const saved = localStorage.getItem(`gonect_profile_${authUser.id}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.name) return parsed.name
      }
    } catch (e) {
      // ignore
    }
    return authUser.name
  })() : ''

  function handleProtectedMenuClick(e, menuName, targetPath) {
    if (!authUser) {
      e.preventDefault()
      if (showAuthModal) {
        showAuthModal(menuName)
      } else {
        navigate('/login')
      }
    } else if (targetPath) {
      navigate(targetPath)
    }
  }

  return (
    <>
      {/* Meta Threads Style Left Navigation Sidebar */}
      <aside className="threads-sidebar-nav left-sidebar-nav">
        <div className="left-sidebar-inner-sticky">
          <div className="sidebar-top-group">
            
            {/* Logo & Brand Header (GoNect) */}
            <Link to="/" className="threads-brand-logo" id="brand-logo" title="GoNect Home">
              <svg className="brand-icon-theme" viewBox="0 0 24 24" style={{ width: '26px', height: '26px', fill: 'var(--color-primary)', marginRight: '6px' }}>
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              <span className="threads-brand-name">GoNect</span>
            </Link>

            {/* Nav Menu Items */}
            <ul className="threads-nav-menu">
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? 'threads-nav-item active' : 'threads-nav-item'} 
                  id="nav-threads"
                >
                  <svg className="threads-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Untuk Anda</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to={authUser ? "/new" : "#"}
                  onClick={(e) => handleProtectedMenuClick(e, 'menu Utas Baru', '/new')}
                  className={({ isActive }) => (isActive && authUser) ? 'threads-nav-item active' : 'threads-nav-item'} 
                  id="nav-new-thread"
                >
                  <svg className="threads-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Utas baru</span>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/search" 
                  className={({ isActive }) => isActive ? 'threads-nav-item active' : 'threads-nav-item'} 
                  id="nav-search-users"
                >
                  <svg className="threads-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Cari Akun</span>
                </NavLink>
              </li>

              <li className="threads-nav-divider" />

              <li>
                <NavLink 
                  to={authUser ? "/messages" : "#"}
                  onClick={(e) => handleProtectedMenuClick(e, 'menu Pesan', '/messages')}
                  className={({ isActive }) => (isActive && authUser) ? 'threads-nav-item active' : 'threads-nav-item'} 
                  id="nav-messages"
                >
                  <svg className="threads-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Pesan</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to={authUser ? "/activity" : "#"}
                  onClick={(e) => handleProtectedMenuClick(e, 'menu Aktivitas', '/activity')}
                  className={({ isActive }) => (isActive && authUser) ? 'threads-nav-item active' : 'threads-nav-item'} 
                  id="nav-activity"
                >
                  <svg className="threads-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span>Aktivitas</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to={authUser ? `/users/${authUser.id}` : "#"} 
                  onClick={(e) => handleProtectedMenuClick(e, 'menu Profil', authUser ? `/users/${authUser.id}` : null)}
                  className={({ isActive }) => (isActive && authUser) ? 'threads-nav-item active' : 'threads-nav-item'} 
                  id="nav-profile"
                >
                  <svg className="threads-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Profil</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/leaderboards" 
                  className={({ isActive }) => isActive ? 'threads-nav-item active' : 'threads-nav-item'} 
                  id="nav-leaderboard"
                >
                  <svg className="threads-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  <span>Leaderboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to={authUser ? "/bookmarks" : "#"}
                  onClick={(e) => handleProtectedMenuClick(e, 'menu Tersimpan', '/bookmarks')}
                  className={({ isActive }) => (isActive && authUser) ? 'threads-nav-item active' : 'threads-nav-item'} 
                  id="nav-bookmarks"
                >
                  <svg className="threads-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Tersimpan</span>
                </NavLink>
              </li>
            </ul>

          </div>

          {/* Bottom Section (Kabar & Lebih Banyak) */}
          <div className="threads-sidebar-bottom">

            <div className="sidebar-more-menu">
              {authUser ? (
                <div className="sidebar-user-widget">
                  <Link to={`/users/${authUser.id}`} className="user-widget-info-link" title="Lihat Profil">
                    <img 
                      src={displayAvatar} 
                      alt={displayName} 
                      className="user-widget-avatar"
                    />
                    <div className="user-widget-meta">
                      <span className="user-widget-name">{displayName}</span>
                      <span className="user-widget-handle">@{displayName.toLowerCase().replace(/\s+/g, '')}</span>
                    </div>
                  </Link>

                  <button 
                    onClick={signOut} 
                    className="btn-user-logout" 
                    id="btn-logout" 
                    type="button"
                    title="Keluar Akun"
                  >
                    <svg viewBox="0 0 24 24" className="logout-icon-svg">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')} 
                  className="sidebar-login-btn" 
                  type="button"
                >
                  <svg viewBox="0 0 24 24" className="login-icon-svg">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Masuk ke Akun</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
          <svg className="mobile-nav-icon-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.1L1 12h3v9h7v-6h2v6h7v-9h3L12 2.1zm5 16.9h-3v-6H10v6H7v-8.2l5-4.5 5 4.5v8.2z" />
          </svg>
          <span>Utas</span>
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
          <svg className="mobile-nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Cari</span>
        </NavLink>

        <NavLink
          to={authUser ? "/new" : "#"}
          onClick={(e) => handleProtectedMenuClick(e, 'fitur Buat Utas', '/new')}
          className="mobile-nav-link mobile-tweet-link"
        >
          <svg className="mobile-nav-icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Buat</span>
        </NavLink>

        <NavLink to="/leaderboards" className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
          <svg className="mobile-nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Peringkat</span>
        </NavLink>

        {authUser ? (
          <NavLink
            to={`/users/${authUser.id}`}
            className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
          >
            <svg className="mobile-nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profil</span>
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
          >
            <svg className="mobile-nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Masuk</span>
          </NavLink>
        )}
      </nav>
    </>
  )
}

export default Navigation
