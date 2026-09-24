import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { postedAt } from '../utils'
import { asyncDeleteComment, asyncEditComment } from '../states/threadDetail/action'
import { useNotification } from '../context/NotificationContext'

function CommentItem({
  id,
  content,
  createdAt,
  owner,
  upVotesBy = [],
  downVotesBy = [],
  authUser,
  upvote,
  downvote,
  addComment
}) {
  const dispatch = useDispatch()
  const { showToast, showConfirm } = useNotification() || {}
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content || '')
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')

  const [showDropdown, setShowDropdown] = useState(false)

  const isUpvoted = authUser && upVotesBy.includes(authUser.id)
  const isDownvoted = authUser && downVotesBy.includes(authUser.id)
  const isOwner = authUser && owner && authUser.id === owner.id
  const handleName = owner?.name ? `@${owner.name.toLowerCase().replace(/\s+/g, '')}` : '@anonymous'

  function handleUpvote() {
    if (!authUser) {
      if (showToast) showToast('Anda harus login terlebih dahulu untuk memberikan suara.', 'warning')
      return
    }
    upvote(id)
  }

  function handleDownvote() {
    if (!authUser) {
      if (showToast) showToast('Anda harus login terlebih dahulu untuk memberikan suara.', 'warning')
      return
    }
    downvote(id)
  }

  function handleDelete() {
    if (showConfirm) {
      showConfirm({
        title: 'Hapus Balasan',
        message: 'Apakah Anda yakin ingin menghapus balasan ini? Tindakan ini tidak dapat dibatalkan.',
        confirmText: 'Ya, Hapus',
        cancelText: 'Batal',
        isDanger: true,
        onConfirm: () => dispatch(asyncDeleteComment(id))
      })
    } else {
      dispatch(asyncDeleteComment(id))
    }
  }

  function handleSaveEdit() {
    if (!editContent.trim()) return
    dispatch(asyncEditComment({ commentId: id, content: editContent }))
    setIsEditing(false)
  }

  function handleToggleReply() {
    if (!authUser) {
      if (showToast) showToast('Anda harus login terlebih dahulu untuk membalas komentar.', 'warning')
      return
    }
    if (!showReplyInput) {
      setReplyText(`${handleName} `)
    }
    setShowReplyInput(!showReplyInput)
  }

  function handleSendReply() {
    if (!replyText.trim()) return
    if (addComment) {
      addComment(replyText)
    }
    setReplyText('')
    setShowReplyInput(false)
  }

  return (
    <div className="comment-item-card" id={`comment-${id}`}>
      <div>
        <Link to={`/users/${owner?.id}`}>
          <img
            src={owner?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
            alt={owner?.name || 'User'}
            className="comment-author-avatar"
          />
        </Link>
      </div>

      <div className="tweet-content-wrapper">
        <div className="tweet-header-meta">
          <div className="tweet-author-meta">
            <Link to={`/users/${owner?.id}`} className="author-link">
              <span className="comment-author-name">{owner?.name || 'Anonymous'}</span>
              <span className="tweet-author-handle">{handleName}</span>
            </Link>
            <span className="tweet-dot-separator">&bull;</span>
            <span className="tweet-post-date">{postedAt(createdAt)}</span>
          </div>

          {/* Three Dots Options / CRUD Menu Icon */}
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
                      Edit Balasan
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        handleDelete()
                        setShowDropdown(false)
                      }}
                      className="threads-menu-item danger"
                    >
                      Hapus Balasan
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (showToast) showToast('Tautan balasan berhasil disalin ke papan klip!', 'success')
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

        {isEditing ? (
          <div className="inline-edit-box">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="inline-edit-textarea"
            />
            <div className="inline-edit-buttons">
              <button type="button" onClick={handleSaveEdit} className="btn-save-edit">Simpan</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel-edit">Batal</button>
            </div>
          </div>
        ) : (
          <p className="comment-body-text">{content}</p>
        )}

        <div className="threads-action-bar comment-action-bar-small">
          {/* Like Button */}
          <button
            className={`threads-action-btn like-btn ${isUpvoted ? 'active' : ''}`}
            onClick={handleUpvote}
            id={`btn-upvote-comment-${id}`}
            title="Suka"
            type="button"
          >
            <svg viewBox="0 0 24 24" className="threads-action-icon">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span className="threads-count-num">{upVotesBy.length}</span>
          </button>

          {/* Dislike Button */}
          <button
            className={`threads-action-btn dislike-btn ${isDownvoted ? 'active-dislike' : ''}`}
            onClick={handleDownvote}
            id={`btn-downvote-comment-${id}`}
            title="Tidak Suka"
            type="button"
          >
            <svg viewBox="0 0 24 24" className="threads-action-icon">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
            </svg>
            <span className="threads-count-num">{downVotesBy.length}</span>
          </button>

          {/* Reply Button */}
          <button
            className="threads-action-btn"
            onClick={handleToggleReply}
            title="Balas"
            type="button"
          >
            <svg viewBox="0 0 24 24" className="threads-action-icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="threads-count-num">Balas</span>
          </button>

          {/* Share Button */}
          <button
            className="threads-action-btn"
            onClick={() => {
              if (showToast) showToast('Tautan balasan berhasil disalin!', 'success')
            }}
            title="Bagikan"
            type="button"
          >
            <svg viewBox="0 0 24 24" className="threads-action-icon">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Inline Reply Textarea Box */}
        {showReplyInput && (
          <div className="inline-reply-box">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Balas ${handleName}...`}
              className="inline-reply-textarea"
              autoFocus
            />
            <div className="inline-reply-actions">
              <button 
                type="button" 
                onClick={() => setShowReplyInput(false)}
                className="btn-cancel-inline-reply"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={handleSendReply}
                className="btn-send-inline-reply"
                disabled={!replyText.trim()}
              >
                Kirim Balasan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentItem
