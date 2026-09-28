import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { asyncReceiveLeaderboards } from '../states/leaderboards/action'
import RightSidebar from '../components/RightSidebar'

import { asyncPopulateUsersAndThreads } from '../states/shared/action'

function LeaderboardPage() {
  const dispatch = useDispatch()
  const { leaderboards = [], threads = [] } = useSelector((state) => state)

  // Ambil data leaderboard & threads jika kosong
  useEffect(() => {
    if (threads.length === 0) {
      dispatch(asyncPopulateUsersAndThreads())
    }
    if (leaderboards.length === 0) {
      dispatch(asyncReceiveLeaderboards())
    }
  }, [dispatch, threads.length, leaderboards.length])

  // Kategori unik dari threads
  const categories = Array.from(
    new Set(threads.map((t) => t.category).filter(Boolean))
  )

  return (
    <>
      <main className="middle-feed-column">
        {/* Header halaman */}
        <div className="feed-sticky-header">
          <h1 className="feed-header-title">Leaderboard</h1>
        </div>

        <div className="leaderboard-section">
          <div className="leaderboard-header-box">
            <h2 className="leaderboard-heading">Active Community Members</h2>
            <p className="leaderboard-subheading">
              Top members leading conversations and contributing to discussions
            </p>
          </div>

          {/* Daftar peringkat pengguna */}
          <div className="leaderboard-list flex-col">
            {leaderboards.map(({ user, score }, index) => {
              const handleName = `@${user.name.toLowerCase().replace(/\s+/g, '')}`
              const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-normal'
              return (
                <div key={user.id} id={`leaderboard-item-${user.id}`} className="leaderboard-user-item">
                  <div className="leaderboard-user-flex">
                    <span className={`leaderboard-rank-num ${rankClass}`}>
                      #{index + 1}
                    </span>
                    <Link to={`/users/${user.id}`} className="leaderboard-user-link">
                      <img
                        src={user.avatar || 'https://ui-avatars.com/api/?name=User'}
                        alt={user.name}
                        className="leaderboard-avatar-img"
                      />
                      <div className="leaderboard-user-meta">
                        <span className="leaderboard-user-name">{user.name}</span>
                        <span className="leaderboard-user-handle">{handleName}</span>
                      </div>
                    </Link>
                  </div>
                  <span className="leaderboard-score-badge">
                    {score} pts
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <RightSidebar categories={categories} />
    </>
  )
}

export default LeaderboardPage
