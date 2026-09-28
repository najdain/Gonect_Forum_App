import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import CommentInput from '../components/CommentInput'
import CommentList from '../components/CommentList'
import RightSidebar from '../components/RightSidebar'
import {
  asyncCreateComment,
  asyncGetThreadDetail,
  asyncToggleDownvoteComment,
  asyncToggleDownvoteDetailThread,
  asyncToggleUpvoteComment,
  asyncToggleUpvoteDetailThread,
  asyncEditThreadDetail
} from '../states/threadDetail/action'
import { asyncDeleteThread, asyncEditThread } from '../states/threads/action'
import { postedAt } from '../utils'
import parse from 'html-react-parser'
import { useNotification } from '../context/NotificationContext'

function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showConfirm } = useNotification() || {}
  const { threadDetail = null, authUser = null, threads = [] } = useSelector((state) => state)

  const [isEditing, setIsEditing] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isDetailTextExpanded, setIsDetailTextExpanded] = useState(false)

  const { showToast } = useNotification() || {}

  useEffect(() => {
    function handleClickOutside() {
      if (showDropdown) {
        setShowDropdown(false)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [showDropdown])

  // Simpan utas ke bookmark
  function handleBookmarkThread() {
    if (!authUser) {
      if (showToast) showToast('Anda harus login terlebih dahulu untuk menyimpan utas.', 'warning')
      return
    }
    const nextState = !isBookmarked
    setIsBookmarked(nextState)
    if (showToast) {
      showToast(nextState ? 'Utas berhasil disimpan ke Tersimpan!' : 'Utas dihapus dari Tersimpan.', 'success')
    }
  }

  // Fetch detail utas berdasarkan ID
  useEffect(() => {
    dispatch(asyncGetThreadDetail(id))
  }, [id, dispatch])

  // Set nilai form saat data utas dimuat
  useEffect(() => {
    if (threadDetail) {
      setEditTitle(threadDetail.title || '')
      setEditBody(threadDetail.body || '')
      setEditCategory(threadDetail.category || '')
    }
  }, [threadDetail])

  // Handler upvote utas
  function handleUpvoteThread() {
    dispatch(asyncToggleUpvoteDetailThread())
  }

  // Handler downvote utas
  function handleDownvoteThread() {
    dispatch(asyncToggleDownvoteDetailThread())
  }

  // Handler tambah komentar
  function handleAddComment(content) {
    dispatch(asyncCreateComment({ threadId: id, content }))
  }

  // Handler upvote komentar
  function handleUpvoteComment(commentId) {
    dispatch(asyncToggleUpvoteComment(commentId))
  }

  // Handler downvote komentar
  function handleDownvoteComment(commentId) {
    dispatch(asyncToggleDownvoteComment(commentId))
  }

  // Handler hapus utas
  function handleDeleteThread() {
    if (showConfirm) {
      showConfirm({
        title: 'Delete Thread',
        message: 'Are you sure you want to delete this thread?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDanger: true,
        onConfirm: () => {
          dispatch(asyncDeleteThread(threadDetail.id))
          navigate('/')
        }
      })
    } else if (window.confirm('Are you sure you want to delete this thread?')) {
      dispatch(asyncDeleteThread(threadDetail.id))
      navigate('/')
    }
  }

  // Handler simpan perubahan utas
  function handleSaveEditThread() {
    if (!editTitle.trim() || !editBody.trim()) return
    dispatch(asyncEditThreadDetail({ title: editTitle, body: editBody, category: editCategory }))
    dispatch(asyncEditThread({ threadId: threadDetail.id, title: editTitle, body: editBody, category: editCategory }))
    setIsEditing(false)
  }

  const categories = Array.from(
    new Set(threads.map((t) => t.category).filter(Boolean))
  )

  if (!threadDetail || threadDetail.id !== id) {
    return (
      <>
        <main className="middle-feed-column detail-loading-container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p className="detail-loading-text" style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: '600' }}>
            Memuat detail utas...
          </p>
        </main>
        <RightSidebar categories={categories} />
      </>
    )
  }

  const upVotesBy = threadDetail.upVotesBy || []
  const downVotesBy = threadDetail.downVotesBy || []
  const comments = threadDetail.comments || []

  const isUpvoted = authUser && upVotesBy.includes(authUser.id)
  const isDownvoted = authUser && downVotesBy.includes(authUser.id)
  const isOwner = authUser && threadDetail.owner && authUser.id === threadDetail.owner.id

  let textBody = threadDetail.body || ''
  let imageUrl = ''
  if (textBody && textBody.includes('\n\n[image-embed]:')) {
    const parts = textBody.split('\n\n[image-embed]:')
    textBody = parts[0]
    imageUrl = parts[1]
  }

  const handleName = threadDetail.owner?.name ? `@${threadDetail.owner.name.toLowerCase().replace(/\s+/g, '')}` : '@anonymous'

  const isDetailLongText = textBody.length > 250
  const displayedDetailText = isDetailLongText && !isDetailTextExpanded ? `${textBody.slice(0, 250)}...` : textBody

  return (
    <>
      <main className="middle-feed-column">
        {/* Sticky Header with Back Button */}
        <div className="feed-sticky-header">
          <div className="detail-header-flex">
            <Link to="/" className="detail-back-link">
              <svg viewBox="0 0 24 24" className="action-icon-svg">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
            <h1 className="feed-header-title detail-header-title-text">Post</h1>
          </div>
        </div>

        <article className="detail-post-card" id={`thread-detail-${threadDetail.id}`}>
          <div className="detail-owner-row">
            <Link to={`/users/${threadDetail.owner?.id}`} className="detail-owner-link">
              <img
                src={threadDetail.owner?.avatar || 'https://ui-avatars.com/api/?name=User'}
                alt={threadDetail.owner?.name || 'User'}
                className="detail-owner-avatar"
              />
              <div className="detail-owner-meta">
                <span className="detail-owner-name">{threadDetail.owner?.name || 'Anonymous'}</span>
                <span className="detail-owner-handle">{handleName}</span>
              </div>
            </Link>

            <div className="detail-owner-actions-right">
              {threadDetail.category && (
                <span className="tweet-hashtag-badge">
                  #{threadDetail.category}
                </span>
              )}

              {/* Three Dots Options Menu */}
              <div className="threads-options-dropdown-container">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowDropdown(!showDropdown)
                  }}
                  className="btn-threads-options"
                  title="Opsi"
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
                            e.preventDefault()
                            e.stopPropagation()
                            setShowDropdown(false)
                            handleDeleteThread()
                          }}
                          className="threads-menu-item danger"
                        >
                          Hapus Utas
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (showToast) showToast('Tautan berhasil disalin ke papan klip!', 'success')
                          navigator.clipboard?.writeText(window.location.href)
                          setShowDropdown(false)
                        }}
                        className="threads-menu-item"
                      >
                        Salin Tautan
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="inline-edit-box">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="inline-edit-input-title"
              />
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="inline-edit-textarea"
              />
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="inline-edit-input-category"
              />
              <div className="inline-edit-buttons">
                <button type="button" onClick={handleSaveEditThread} className="btn-save-edit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel-edit">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="detail-title-text">
                {threadDetail.title}
              </h1>
              <div className="detail-body-text">
                {parse(displayedDetailText)}
                {isDetailLongText && (
                  <button
                    type="button"
                    className="btn-read-more"
                    onClick={() => setIsDetailTextExpanded(!isDetailTextExpanded)}
                  >
                    {isDetailTextExpanded ? ' Sembunyikan' : ' Baca selengkapnya'}
                  </button>
                )}
              </div>

              {imageUrl && (
                <div className="tweet-media-attachment detail-media-attachment">
                  <img src={imageUrl} alt="thread media attachment" className="tweet-media-img detail-media-img" />
                </div>
              )}
            </>
          )}

          <div className="detail-timestamp-bar">
            {postedAt(threadDetail.createdAt)}
          </div>

          <div className="tweet-action-bar detail-action-bar flex-full-width">
            <button
              className={`tweet-action-btn like-btn ${isUpvoted ? 'active' : ''}`}
              onClick={handleUpvoteThread}
              id="btn-detail-upvote"
              title="Upvote / Like"
              type="button"
            >
              <svg viewBox="0 0 24 24" className="action-icon-svg">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span className="vote-count">{upVotesBy.length}</span>
            </button>

            <button
              className={`tweet-action-btn dislike-btn ${isDownvoted ? 'active' : ''}`}
              onClick={handleDownvoteThread}
              id="btn-detail-downvote"
              title="Downvote"
              type="button"
            >
              <svg viewBox="0 0 24 24" className="action-icon-svg">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
              </svg>
              <span className="vote-count">{downVotesBy.length}</span>
            </button>

            <button
              className={`tweet-action-btn ${isBookmarked ? 'active-bookmark' : ''}`}
              onClick={handleBookmarkThread}
              id="btn-detail-bookmark"
              title="Simpan Utas"
              type="button"
            >
              <svg viewBox="0 0 24 24" className="action-icon-svg" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </article>

        <section>
          {authUser ? (
            <CommentInput addComment={handleAddComment} authUser={authUser} />
          ) : (
            <div className="detail-login-notice">
              Please <Link to="/login" id="link-comment-login" className="login-notice-link">Sign In</Link> to reply to this post.
            </div>
          )}

          <div className="detail-comments-header" id="comments-title">
            Replies ({comments.length})
          </div>

          <CommentList
            comments={comments}
            authUser={authUser}
            upvoteComment={handleUpvoteComment}
            downvoteComment={handleDownvoteComment}
            addComment={handleAddComment}
          />
        </section>
      </main>

      <RightSidebar categories={categories} />
    </>
  )
}

export default DetailPage
