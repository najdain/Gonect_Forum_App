import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import RightSidebar from '../components/RightSidebar'
import { asyncPopulateUsersAndThreads } from '../states/shared/action'

function ActivityPage() {
  const dispatch = useDispatch()
  const { threads = [] } = useSelector((state) => state)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    if (threads.length === 0) {
      dispatch(asyncPopulateUsersAndThreads())
    }
  }, [dispatch, threads.length])

  const dummyNotifications = [
    {
      id: 1,
      type: 'like',
      user: {
        id: 'user-maria',
        name: 'Maria',
        handle: '@maria_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      text: 'menyukai utas Anda',
      targetTitle: '"Panduan Menggunakan Redux Toolkit di React 19"',
      time: '10 menit lalu',
      icon: '💖'
    },
    {
      id: 2,
      type: 'reply',
      user: {
        id: 'user-maria',
        name: 'Maria',
        handle: '@maria_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      text: 'membalas utas Anda:',
      contentSnippet: '"Sangat membantu! Penjelasannya ringkas dan langsung ke poin utama."',
      time: '45 menit lalu',
      icon: '💬'
    },
    {
      id: 3,
      type: 'follow',
      user: {
        id: 'user-maria',
        name: 'Maria',
        handle: '@maria_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      text: 'mulai mengikuti Anda',
      time: '2 jam lalu',
      icon: '👤'
    },
    {
      id: 4,
      type: 'points',
      user: {
        name: 'Sistem GoNect',
        handle: '@gonect_system',
        avatar: 'https://ui-avatars.com/api/?name=GoNect&background=14b8a6&color=fff'
      },
      text: 'Selamat! Anda mendapatkan +10 pts atas aktivitas kontribusi harian.',
      time: '5 jam lalu',
      icon: '🏆'
    },
    {
      id: 5,
      type: 'repost',
      user: {
        id: 'user-alex',
        name: 'Alex Rivera',
        handle: '@alex_tech',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      },
      text: 'mem-repost utas Anda',
      targetTitle: '"Tips Membangun REST API Modern dengan Node.js"',
      time: '1 hari lalu',
      icon: '🔄'
    }
  ]

  const filteredNotifications = dummyNotifications.filter((notif) => {
    if (activeFilter === 'likes') return notif.type === 'like'
    if (activeFilter === 'replies') return notif.type === 'reply'
    if (activeFilter === 'follows') return notif.type === 'follow'
    if (activeFilter === 'points') return notif.type === 'points'
    return true
  })

  const categories = Array.from(
    new Set(threads.map((t) => t.category).filter(Boolean))
  )

  return (
    <>
      <main className="middle-feed-column">
        <div className="feed-sticky-header">
          <h1 className="feed-header-title">Aktivitas & Notifikasi</h1>
        </div>

        <div className="profile-pill-tabs-wrapper" style={{ padding: '12px 16px' }}>
          <button
            type="button"
            className={`profile-pill-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Semua
          </button>
          <button
            type="button"
            className={`profile-pill-tab ${activeFilter === 'likes' ? 'active' : ''}`}
            onClick={() => setActiveFilter('likes')}
          >
            Sukaan
          </button>
          <button
            type="button"
            className={`profile-pill-tab ${activeFilter === 'replies' ? 'active' : ''}`}
            onClick={() => setActiveFilter('replies')}
          >
            Balasan
          </button>
          <button
            type="button"
            className={`profile-pill-tab ${activeFilter === 'follows' ? 'active' : ''}`}
            onClick={() => setActiveFilter('follows')}
          >
            Pengikut
          </button>
          <button
            type="button"
            className={`profile-pill-tab ${activeFilter === 'points' ? 'active' : ''}`}
            onClick={() => setActiveFilter('points')}
          >
            Poin
          </button>
        </div>

        <div className="activity-list-wrapper">
          {filteredNotifications.map((notif) => (
            <div key={notif.id} className="activity-item-card">
              <div className="activity-icon-badge">{notif.icon}</div>
              <img src={notif.user.avatar} alt={notif.user.name} className="activity-user-avatar" />
              <div className="activity-content-box">
                <div className="activity-text-line">
                  <span className="activity-user-name">{notif.user.name}</span>{' '}
                  <span className="activity-action-text">{notif.text}</span>
                  {notif.targetTitle && <span className="activity-target-title"> {notif.targetTitle}</span>}
                </div>

                {notif.contentSnippet && (
                  <p className="activity-snippet-text">{notif.contentSnippet}</p>
                )}

                <span className="activity-time-text">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <RightSidebar categories={categories} />
    </>
  )
}

export default ActivityPage
