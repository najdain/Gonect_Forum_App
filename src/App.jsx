import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useLocation } from 'react-router-dom'
import LoadingBar from './components/LoadingBar'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DetailPage from './pages/DetailPage'
import AddThreadPage from './pages/AddThreadPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import SearchUsersPage from './pages/SearchUsersPage'
import MessagesPage from './pages/MessagesPage'
import ActivityPage from './pages/ActivityPage'
import BookmarksPage from './pages/BookmarksPage'
import { NotificationProvider } from './context/NotificationContext'
import { asyncPreloadProcess } from './states/isPreload/action'
import { asyncUnsetAuthUser } from './states/authUser/action'

function App() {
  const { authUser = null, isPreload = true } = useSelector((state) => state)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(asyncPreloadProcess())
  }, [dispatch])

  function onSignOut() {
    dispatch(asyncUnsetAuthUser())
  }

  if (isPreload) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', fontWeight: '600' }}>Initializing GoNect...</p>
      </div>
    )
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <NotificationProvider>
      <LoadingBar />
      
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      ) : (
        <div className="app-layout-container">
          <Navigation authUser={authUser} signOut={onSignOut} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchUsersPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/threads/:id" element={<DetailPage />} />
            <Route path="/new" element={<AddThreadPage />} />
            <Route path="/leaderboards" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:id" element={<ProfilePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      )}
    </NotificationProvider>
  )
}

export default App
