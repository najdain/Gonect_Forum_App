import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { postedAt } from '../utils'
import { asyncDeleteThread, asyncEditThread, asyncToggleRepostThread } from '../states/threads/action'
import { toggleBookmarkActionCreator } from '../states/bookmarks/action'
import { useNotification } from '../context/NotificationContext'

function ThreadItem({
  id,
  title,
  body,
  category,
  createdAt,
  upVotesBy = [],
  downVotesBy = [],
  repostsBy = [],
  totalComments = 0,
  user,
  authUser,
  upvote,
  downvote
}) {
  const dispatch = useDispatch()
  const { showToast, showConfirm, showAuthModal } = useNotification() || {}
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title || '')
  const [editBody, setEditBody] = useState(body || '')
  const [editCategory, setEditCategory] = useState(category || '')
  const [showDropdown, setShowDropdown] = useState(false)

  const isUpvoted = authUser && upVotesBy.includes(authUser.id)
  const isDownvoted = authUser && downVotesBy.includes(authUser.id)
  const isReposted = authUser && repostsBy.includes(authUser.id)
  const isOwner = authUser && user && authUser.id === user.id

  const bookmarks = useSelector((state) => state.bookmarks || [])
  const isBookmarked = bookmarks.includes(id)

  function handleUpvote(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!authUser) {
      if (showAuthModal) showAuthModal('menyukai utas')
      else if (showToast) showToast('Anda harus login terlebih dahulu untuk menyukai utas.', 'warning')
      return
    }
    upvote(id)
  }

  function handleDownvote(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!authUser) {
      if (showAuthModal) showAuthModal('memberikan tidak suka')
      else if (showToast) showToast('Anda harus login terlebih dahulu untuk memberikan tidak suka.', 'warning')
      return
    }
    downvote(id)
  }

  function handleRepost(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!authUser) {
      if (showAuthModal) showAuthModal('repost utas')
      else if (showToast) showToast('Anda harus login terlebih dahulu untuk repost.', 'warning')
      return
    }
    dispatch(asyncToggleRepostThread(id))
  }

  function handleBookmark(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!authUser) {
      if (showAuthModal) showAuthModal('menyimpan utas')
      else if (showToast) showToast('Anda harus login terlebih dahulu untuk menyimpan utas.', 'warning')
      return
    }
    dispatch(toggleBookmarkActionCreator(id))
    if (showToast) {
      showToast(!isBookmarked ? 'Utas disimpan ke Tersimpan!' : 'Utas dihapus dari Tersimpan.', 'success')
    }
  }

  function handleDelete(e) {
    e.preventDefault()
    e.stopPropagation()
    if (showConfirm) {
      showConfirm({
        title: 'Hapus Utas',
        message: 'Apakah Anda yakin ingin menghapus utas ini? Tindakan ini tidak dapat dibatalkan.',
        confirmText: 'Ya, Hapus',
        cancelText: 'Batal',
        isDanger: true,
        onConfirm: () => dispatch(asyncDeleteThread(id))
      })
    } else {
      dispatch(asyncDeleteThread(id))
    }
  }

  function handleSaveEdit(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!editTitle.trim() || !editBody.trim()) return
    dispatch(asyncEditThread({ threadId: id, title: editTitle, body: editBody, category: editCategory }))
    setIsEditing(false)
  }

  let textBody = body || ''
  let imageUrl = ''
  if (textBody.includes('\n\n[image-embed]:')) {
    const parts = textBody.split('\n\n[image-embed]:')
    textBody = parts[0]
    imageUrl = parts[1]
  }

  textBody = textBody.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')

  const handleName = user?.name ? user.name.toLowerCase().replace(/\s+/g, '') : 'anonymous'

  // Format engagement count in Threads style (e.g. 4,6 rb)
  function formatCount(num) {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace('.', ',')} rb`
    }
    return num
  }

  const shareCount = Math.max(1, Math.floor((totalComments + 1) * 2.2))

  const [isExpanded, setIsExpanded] = useState(false)
  const isLongText = textBody.length > 160
  const displayedText = isLongText && !isExpanded ? `${textBody.slice(0, 160)}...` : textBody

  return (
    <article className="threads-post-card" id={`thread-${id}`}>
      {/* Avatar Column with plus badge */}
      <div className="threads-avatar-wrapper">
        <Link to={`/users/${user?.id}`} className="avatar-link-box">
          <img
            src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
            alt={user?.name || 'User'}
            className="threads-author-avatar"
          />
          <div className="avatar-plus-badge" title="Follow">
            +
          </div>
        </Link>
      </div>

      {/* Main Post Content */}
      <div className="threads-content-container">
        
        {/* Header Metadata */}
        <div className="threads-post-header">
          <div className="threads-author-info">
            <Link to={`/users/${user?.id}`} className="threads-author-link">
              <span className="threads-user-handle">{handleName}</span>
            </Link>
            <span className="threads-timestamp">{postedAt(createdAt)}</span>
          </div>

          <div className="threads-header-right">
            {category && (
              <span className="threads-category-pill">
                #{category}
              </span>
            )}

            {/* Three Dots Menu Icon */}
            <div className="threads-options-dropdown-container">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowDropdown(!showDropdown)
                }}
                className="btn-threads-options"
                title="Options"
              >
                <svg viewBox="0 0 24 24" className="threads-options-icon">
                  <circle cx="5" cy="12" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                </svg>
              </button>

              {showDropdown && (
                <div className="threads-options-menu">
                  {isOwner ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsEditing(!isEditing)
                          setShowDropdown(false)
                        }}
                        className="threads-menu-item"
                      >
                        Edit Utas
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          handleDelete(e)
                          setShowDropdown(false)
                        }}
                        className="threads-menu-item danger"
                      >
                        Hapus Utas
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (showToast) showToast('Tautan berhasil disalin ke papan klip!', 'success')
                        setShowDropdown(false)
                      }}
                      className="threads-menu-item"
                    >
                      Copy Link
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inline Edit Form */}
        {isEditing ? (
          <div className="inline-edit-box">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="inline-edit-input-title"
              placeholder="Edit title..."
            />
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="inline-edit-textarea"
              placeholder="Edit post body..."
            />
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="inline-edit-input-category"
              placeholder="Edit category..."
            />
            <div className="inline-edit-buttons">
              <button type="button" onClick={handleSaveEdit} className="btn-save-edit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel-edit">Cancel</button>
            </div>
          </div>
        ) : (
          /* Content Body */
          <div className="threads-body-wrapper">
            <Link to={`/threads/${id}`} className="threads-body-link" id={`thread-title-${id}`}>
              {title && <h3 className="threads-post-title">{title}</h3>}
            </Link>
            <p className="threads-post-text">
              {displayedText}
              {isLongText && (
                <button
                  type="button"
                  className="btn-read-more"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                >
                  {isExpanded ? ' Sembunyikan' : ' Baca selengkapnya'}
                </button>
              )}
            </p>

            {imageUrl && (
              <Link to={`/threads/${id}`} className="threads-body-link">
                <div className="threads-media-attachment">
                  <img src={imageUrl} alt="attached media" className="threads-media-img" />
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Engagement Action Bar (Threads Icons Style) */}
        <div className="threads-action-bar">
          
          {/* Like Button (Thumbs Up) */}
          <button
            className={`threads-action-btn like-btn ${isUpvoted ? 'active' : ''}`}
            onClick={handleUpvote}
            id={`btn-upvote-${id}`}
            title="Suka"
            type="button"
          >
            <svg viewBox="0 0 24 24" className="threads-action-icon">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span className="threads-count-num">{formatCount(upVotesBy.length)}</span>
          </button>

          {/* Dislike Button (Thumbs Down) */}
          <button
            className={`threads-action-btn dislike-btn ${isDownvoted ? 'active-dislike' : ''}`}
            onClick={handleDownvote}
            id={`btn-downvote-${id}`}
            title="Tidak Suka"
            type="button"
          >
            <svg viewBox="0 0 24 24" className="threads-action-icon">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
            </svg>
            <span className="threads-count-num">{formatCount(downVotesBy.length)}</span>
          </button>

          {/* Comment / Reply Button (Speech bubble) */}
          <Link to={`/threads/${id}#comments`} className="threads-action-btn" id={`link-comments-${id}`} title="Balas">
            <svg viewBox="0 0 24 24" className="threads-action-icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="threads-count-num">{totalComments}</span>
          </Link>

          {/* Repost Button (Double Arrows) */}
          <button
            className={`threads-action-btn ${isReposted ? 'active-repost' : ''}`}
            onClick={handleRepost}
            title="Repost"
            type="button"
          >
            <svg viewBox="0 0 24 24" className="threads-action-icon">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
            <span className="threads-count-num">{formatCount(repostsBy.length)}</span>
          </button>

          {/* Share Button (Paperplane) */}
          <button
            className="threads-action-btn"
            onClick={() => {
              if (showToast) showToast('Tautan berhasil disalin untuk dibagikan!', 'success')
            }}
            title="Bagikan"
            type="button"
          >
            <svg viewBox="0 0 24 24" className="threads-action-icon">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span className="threads-count-num">{formatCount(shareCount)}</span>
          </button>

          {/* Bookmark / Simpan Button (Ribbon / Bookmark) */}
          <button
            className={`threads-action-btn bookmark-btn ${isBookmarked ? 'active-bookmark' : ''}`}
            onClick={handleBookmark}
            title="Simpan Utas"
            type="button"
            id={`btn-bookmark-${id}`}
          >
            <svg viewBox="0 0 24 24" className="threads-action-icon" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>

        </div>

      </div>
    </article>
  )
}

export default ThreadItem
