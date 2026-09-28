import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import RightSidebar from '../components/RightSidebar'
import { asyncPopulateUsersAndThreads } from '../states/shared/action'
import { asyncReceiveLeaderboards } from '../states/leaderboards/action'

function SearchUsersPage() {
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const { users = [], leaderboards = [], threads = [] } = useSelector((state) => state)

  // Ambil data awal users, threads, dan leaderboards
  useEffect(() => {
    if (threads.length === 0 || users.length === 0) {
      dispatch(asyncPopulateUsersAndThreads())
    }
    if (leaderboards.length === 0) {
      dispatch(asyncReceiveLeaderboards())
    }
  }, [dispatch, threads.length, users.length, leaderboards.length])

  // Gabungkan profil pengguna unik
  const allUsers = useMemo(() => {
    const userMap = new Map()

    users.forEach((u) => {
      if (u && u.id) userMap.set(u.id, u)
    })

    leaderboards.forEach((item) => {
      if (item.user && item.user.id) {
        const existing = userMap.get(item.user.id)
        userMap.set(item.user.id, { ...item.user, ...existing })
      }
    })

    return Array.from(userMap.values())
  }, [users, leaderboards])

  // Petakan skor leaderboard pengguna
  const leaderboardScoreMap = useMemo(() => {
    const map = new Map()
    leaderboards.forEach((item) => {
      if (item.user?.id) {
        map.set(item.user.id, item.score)
      }
    })
    return map
  }, [leaderboards])

  const [visibleCount, setVisibleCount] = useState(50)

  // Filter daftar pengguna berdasarkan query
  const filteredUsers = useMemo(() => {
    const queryLower = searchQuery.trim().toLowerCase()
    if (!queryLower) return allUsers
    return allUsers.filter((u) => {
      const handle = `@${u.name.toLowerCase().replace(/\s+/g, '')}`
      return (
        u.name.toLowerCase().includes(queryLower) ||
        handle.includes(queryLower) ||
        (u.email && u.email.toLowerCase().includes(queryLower))
      )
    })
  }, [searchQuery, allUsers])

  // Reset pagination when search query changes
  useEffect(() => {
    setVisibleCount(50)
  }, [searchQuery])

  const displayedUsers = useMemo(() => {
    return filteredUsers.slice(0, visibleCount)
  }, [filteredUsers, visibleCount])

  const categories = useMemo(() => {
    return Array.from(
      new Set(threads.map((t) => t.category).filter(Boolean))
    )
  }, [threads])

  return (
    <>
      <main className="middle-feed-column">
        <div className="feed-sticky-header">
          <h1 className="feed-header-title">Cari Akun & Pengguna</h1>
        </div>

        <div style={{ padding: '20px' }}>
          <div className="user-search-page-bar">
            <svg viewBox="0 0 24 24" className="user-search-page-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama anggota, @username, atau email..."
              className="user-search-page-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search-page"
                onClick={() => setSearchQuery('')}
              >
                &times;
              </button>
            )}
          </div>

          <div className="user-search-page-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="user-search-count-label">
              {searchQuery 
                ? `Hasil Pencarian: ${filteredUsers.length} Ditemukan (Menampilkan ${displayedUsers.length})` 
                : `Menampilkan ${displayedUsers.length} dari ${allUsers.length} Anggota Komunitas`}
            </span>
          </div>

          <div className="user-search-cards-list">
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => {
                const pts = leaderboardScoreMap.get(user.id) || 0
                const handleName = `@${user.name.toLowerCase().replace(/\s+/g, '')}`

                return (
                  <div key={user.id} className="user-card-item">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="user-card-avatar"
                      loading="lazy"
                    />
                    <div className="user-card-info">
                      <div className="user-card-name-row">
                        <span className="user-card-name">{user.name}</span>
                        {pts > 0 && (
                          <span className="user-card-badge">{pts} pts</span>
                        )}
                      </div>
                      <span className="user-card-handle">{handleName}</span>
                    </div>

                    <Link to={`/users/${user.id}`} className="btn-view-user-profile">
                      Lihat Profil
                    </Link>
                  </div>
                )
              })
            ) : (
              <div className="user-search-no-results">
                <svg viewBox="0 0 24 24" className="no-results-svg">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p className="no-results-text">Tidak ada pengguna yang cocok dengan &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>

          {visibleCount < filteredUsers.length && (
            <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px' }}>
              <button
                type="button"
                className="btn-load-more-users"
                onClick={() => setVisibleCount((prev) => prev + 50)}
              >
                Muat 50 Anggota Lainnya ({filteredUsers.length - visibleCount} tersisa)
              </button>
            </div>
          )}
        </div>
      </main>

      <RightSidebar categories={categories} />
    </>
  )
}

export default SearchUsersPage
