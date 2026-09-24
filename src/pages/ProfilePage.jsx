import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { asyncPopulateUsersAndThreads } from '../states/shared/action'
import { asyncToggleUpvoteThread, asyncToggleDownvoteThread } from '../states/threads/action'
import { asyncReceiveLeaderboards } from '../states/leaderboards/action'
import { updateAuthUserActionCreator } from '../states/authUser/action'
import { updateUserActionCreator } from '../states/users/action'
import ThreadItem from '../components/ThreadItem'
import RightSidebar from '../components/RightSidebar'
import { useNotification } from '../context/NotificationContext'

function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showToast } = useNotification() || {}
  const { authUser = null, users = [], threads = [], leaderboards = [] } = useSelector((state) => state)

  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  useEffect(() => {
    if (threads.length === 0 || users.length === 0) {
      dispatch(asyncPopulateUsersAndThreads())
    }
    if (leaderboards.length === 0) {
      dispatch(asyncReceiveLeaderboards())
    }
  }, [dispatch, threads.length, users.length, leaderboards.length])

  const targetId = id || authUser?.id || ''
  const isOwnProfile = authUser && authUser.id === targetId

  const rawUser =
    users.find((u) => u.id === targetId) ||
    (authUser && authUser.id === targetId ? authUser : null) ||
    {
      id: targetId,
      name: 'User',
      email: `${targetId}@example.com`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(targetId || 'User')}&background=0D8ABC&color=fff`
    }

  const savedOverride = localStorage.getItem(`gonect_profile_${targetId}`)
  let profileUser = rawUser
  if (savedOverride) {
    try {
      const parsed = JSON.parse(savedOverride)
      profileUser = { ...rawUser, ...parsed }
    } catch (e) {
    }
  }

  const [editName, setEditName] = useState(profileUser.name || '')
  const [editBio, setEditBio] = useState(
    profileUser.bio || 'Frontend Developer & Tech Enthusiast 🚀 | Building modern web applications with React & Redux.'
  )
  const [editAvatar, setEditAvatar] = useState(profileUser.avatar || '')

  useEffect(() => {
    setEditName(profileUser.name || '')
    setEditBio(
      profileUser.bio || 'Frontend Developer & Tech Enthusiast 🚀 | Building modern web applications with React & Redux.'
    )
    setEditAvatar(profileUser.avatar || '')
  }, [profileUser.name, profileUser.bio, profileUser.avatar, isEditingProfile])

  const handleName = profileUser.name ? `@${profileUser.name.toLowerCase().replace(/\s+/g, '')}` : '@anonymous'

  const leaderboardEntry = leaderboards.find((item) => item.user?.id === targetId)
  const userThreads = threads.filter((t) => {
    if (t.ownerId) return t.ownerId === profileUser.id
    if (t.user && t.user.id) return t.user.id === profileUser.id
    return false
  })
  const likedThreads = threads.filter((t) => t.upVotesBy && t.upVotesBy.includes(profileUser.id))
  const repostedThreads = threads.filter((t) => t.repostsBy && t.repostsBy.includes(profileUser.id))

  const userPoints = leaderboardEntry
    ? leaderboardEntry.score
    : (userThreads.length * 15 + likedThreads.length * 5 + 30)

  let displayedThreads = userThreads
  if (activeTab === 'reposts') {
    displayedThreads = repostedThreads
  } else if (activeTab === 'likes') {
    displayedThreads = likedThreads
  }

  const categories = Array.from(
    new Set(threads.map((t) => t.category).filter(Boolean))
  )

  function handleUpvote(threadId) {
    dispatch(asyncToggleUpvoteThread(threadId))
  }

  function handleDownvote(threadId) {
    dispatch(asyncToggleDownvoteThread(threadId))
  }

  function handleAvatarFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setEditAvatar(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleSaveProfile(e) {
    e.preventDefault()
    if (!editName.trim()) return

    const updatedData = {
      id: targetId,
      name: editName.trim(),
      bio: editBio.trim(),
      avatar: editAvatar
    }

    localStorage.setItem(`gonect_profile_${targetId}`, JSON.stringify(updatedData))
    if (authUser?.id) {
      localStorage.setItem(`gonect_profile_${authUser.id}`, JSON.stringify({ ...updatedData, id: authUser.id }))
    }

    if (isOwnProfile || (authUser && authUser.id === targetId)) {
      dispatch(updateAuthUserActionCreator(updatedData))
    }
    dispatch(updateUserActionCreator(updatedData))

    if (showToast) showToast('Profil berhasil diperbarui!', 'success')
    setIsEditingProfile(false)
  }

  return (
    <>
      <main className="middle-feed-column">
        <div className="feed-sticky-header">
          <div className="profile-header-flex">
            <button
              onClick={() => navigate(-1)}
              className="profile-back-btn"
              title="Kembali"
              type="button"
            >
              <svg viewBox="0 0 24 24" className="action-icon-svg">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div className="profile-header-title-box">
              <h1 className="feed-header-title profile-header-name">{profileUser.name}</h1>
              <span className="profile-header-subcount">{userThreads.length} Utas Dipublikasikan</span>
            </div>
          </div>
        </div>

        <div className="profile-card-container">
          <div className="profile-card-header-bg">
            <div className="profile-card-badge-tag">Community Member</div>
          </div>

          <div className="profile-card-body">
            <div className="profile-card-top-row">
              <div className="profile-avatar-wrapper">
                <img
                  src={profileUser.avatar || 'https://ui-avatars.com/api/?name=User'}
                  alt={profileUser.name}
                  className="profile-card-avatar"
                />
                <span className="profile-status-online" title="Online" />
              </div>

              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="btn-profile-edit-modern"
                >
                  Edit Profil
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`btn-profile-follow-modern ${isFollowing ? 'following' : ''}`}
                >
                  {isFollowing ? 'Mengikuti' : '+ Ikuti'}
                </button>
              )}
            </div>

            <div className="profile-user-main-info">
              <h2 className="profile-card-name">{profileUser.name}</h2>
              <p className="profile-card-handle">{handleName}</p>
            </div>

            <p className="profile-card-bio">
              {profileUser.bio || 'Frontend Developer & Tech Enthusiast 🚀 | Building modern web applications with React & Redux. Passionate about UI/UX design.'}
            </p>

            {/* User Points Card inside Profile */}
            <div className="profile-points-card">
              <div className="points-badge-icon">🏆</div>
              <div className="points-info-box">
                <div className="points-val-row">
                  <span className="points-amount">{userPoints}</span>
                  <span className="points-unit">pts</span>
                </div>
                <span className="points-title">Total Poin Terkumpul</span>
              </div>
            </div>

            <div className="profile-stat-chips-row">
              <div className="stat-chip-item highlight-points">
                <span className="stat-chip-num">{userPoints}</span>
                <span className="stat-chip-label">Poin</span>
              </div>
              <div className="stat-chip-item">
                <span className="stat-chip-num">{userThreads.length}</span>
                <span className="stat-chip-label">Utas</span>
              </div>
              <div className="stat-chip-item">
                <span className="stat-chip-num">142</span>
                <span className="stat-chip-label">Mengikuti</span>
              </div>
              <div className="stat-chip-item">
                <span className="stat-chip-num">1.2K</span>
                <span className="stat-chip-label">Pengikut</span>
              </div>
            </div>
          </div>
        </div>

        {isEditingProfile && (
          <div className="modal-overlay" onClick={() => setIsEditingProfile(false)}>
            <div className="edit-profile-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="edit-profile-modal-header">
                <h3>Edit Profil Saya</h3>
                <button
                  type="button"
                  className="btn-modal-close"
                  onClick={() => setIsEditingProfile(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="edit-profile-form">
                <div className="edit-avatar-preview-box">
                  <img
                    src={editAvatar || 'https://ui-avatars.com/api/?name=User'}
                    alt="Preview Avatar"
                    className="edit-avatar-img-preview"
                  />
                  <div className="edit-avatar-actions">
                    <label className="btn-upload-avatar-label">
                      Unggah Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Atau masukkan URL foto avatar..."
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="edit-avatar-url-input"
                    />
                  </div>
                </div>

                <div className="form-group-field">
                  <label className="field-label">Nama Lengkap</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nama lengkap Anda..."
                    className="field-input"
                    required
                  />
                </div>

                <div className="form-group-field">
                  <label className="field-label">Bio / Tentang Anda</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tuliskan bio atau deskripsi tentang Anda..."
                    className="field-textarea"
                    rows={3}
                  />
                </div>

                <div className="edit-profile-modal-actions">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="btn-edit-modal-cancel"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn-edit-modal-save">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="profile-pill-tabs-wrapper">
          <button
            className={`profile-pill-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
            type="button"
          >
            Utas ({userThreads.length})
          </button>
          <button
            className={`profile-pill-tab ${activeTab === 'reposts' ? 'active' : ''}`}
            onClick={() => setActiveTab('reposts')}
            type="button"
          >
            Di-repost ({repostedThreads.length})
          </button>
          <button
            className={`profile-pill-tab ${activeTab === 'likes' ? 'active' : ''}`}
            onClick={() => setActiveTab('likes')}
            type="button"
          >
            Sukaan ({likedThreads.length})
          </button>
        </div>

        <div>
          {displayedThreads.length > 0 ? (
            displayedThreads.map((thread) => {
              const author =
                users.find((u) => u.id === thread.ownerId) ||
                (thread.user ? thread.user : profileUser)
              return (
                <ThreadItem
                  key={thread.id}
                  id={thread.id}
                  title={thread.title}
                  body={thread.body}
                  category={thread.category}
                  createdAt={thread.createdAt}
                  upVotesBy={thread.upVotesBy || []}
                  downVotesBy={thread.downVotesBy || []}
                  repostsBy={thread.repostsBy || []}
                  totalComments={thread.totalComments || 0}
                  user={author}
                  authUser={authUser}
                  upvote={handleUpvote}
                  downvote={handleDownvote}
                />
              )
            })
          ) : (
            <div className="profile-empty-state">
              <p className="empty-state-text">
                {activeTab === 'posts' && 'Belum ada utas yang dipublikasikan.'}
                {activeTab === 'reposts' && 'Belum ada utas yang di-repost.'}
                {activeTab === 'likes' && 'Belum ada utas yang disukai.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <RightSidebar categories={categories} />
    </>
  )
}

export default ProfilePage
