import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function RightSidebar({ categories = [], selectedCategory, onSelectCategory }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchQuery = searchParams.get('q') || ''

  const { leaderboards = [] } = useSelector((state) => state)

  function handleSearchChange(event) {
    const val = event.target.value
    if (val) {
      setSearchParams({ q: val })
      if (window.location.pathname !== '/') {
        navigate(`/?q=${encodeURIComponent(val)}`)
      }
    } else {
      searchParams.delete('q')
      setSearchParams(searchParams)
    }
  }

  return (
    <aside className="right-sidebar-widget">
      <div className="right-sidebar-inner-sticky">
        {/* Category & Discussion Search Input Box */}
        <div className="widget-search-box">
          <svg 
            viewBox="0 0 24 24" 
            style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '16px', 
              height: '16px', 
              color: 'var(--text-muted)', 
              fill: 'none', 
              stroke: 'currentColor', 
              strokeWidth: '2.5' 
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cari kategori & diskusi..."
            className="widget-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => {
                searchParams.delete('q')
                setSearchParams(searchParams)
              }}
              title="Bersihkan"
            >
              &times;
            </button>
          )}
        </div>

        {/* Trending Hashtags Widget */}
        <div className="widget-card">
          <h3 className="widget-title">
            <span>What&apos;s Trending</span>
          </h3>

          <div className="hashtag-trend-list">
            <div 
              className="hashtag-trend-item" 
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory('')
                } else {
                  navigate('/')
                }
              }}
              style={{ backgroundColor: selectedCategory === '' ? 'rgba(20, 184, 166, 0.08)' : 'transparent' }}
            >
              <span className="hashtag-count">Topic &bull; All Topics</span>
              <span className="hashtag-name" style={{ color: selectedCategory === '' ? 'var(--color-primary)' : 'inherit' }}># All Discussions</span>
            </div>

            {categories.map((cat) => (
              <div
                key={cat}
                className="hashtag-trend-item"
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(cat)
                  } else {
                    navigate(`/?q=${encodeURIComponent(cat)}`)
                  }
                }}
                style={{ backgroundColor: selectedCategory === cat ? 'rgba(20, 184, 166, 0.08)' : 'transparent' }}
              >
                <span className="hashtag-count">Trending in Developer Hub</span>
                <span className="hashtag-name" style={{ color: selectedCategory === cat ? 'var(--color-primary)' : 'inherit' }}>
                  #{cat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Who to Follow / Top Members Widget */}
        <div className="widget-card">
          <h3 className="widget-title">
            <span>Top Contributors</span>
            <Link to="/leaderboards" style={{ fontSize: '13px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '700' }}>
              View All
            </Link>
          </h3>

          <div className="who-to-follow-list">
            {leaderboards.slice(0, 4).map(({ user, score }) => (
              <div key={user.id} className="follow-user-item">
                <Link to={`/users/${user.id}`} className="follow-user-info" style={{ textDecoration: 'none' }}>
                  <img
                    src={user.avatar || 'https://ui-avatars.com/api/?name=User'}
                    alt={user.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{user.name.toLowerCase().replace(/\s+/g, '')}</span>
                  </div>
                </Link>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-primary)', background: 'rgba(20, 184, 166, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                  {score} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default RightSidebar
