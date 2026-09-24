import useInput from '../hooks/useInput'

function CommentInput({ addComment, authUser }) {
  const [content, handleContentChange, resetContent] = useInput('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!content.trim()) return
    addComment(content)
    resetContent()
  }

  return (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
      <img
        src={authUser?.avatar || 'https://ui-avatars.com/api/?name=User'}
        alt={authUser?.name || 'User'}
        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
      />
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <textarea
          id="comment-text"
          placeholder="Post your reply..."
          value={content}
          onChange={handleContentChange}
          required
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            fontFamily: 'inherit',
            resize: 'none',
            minHeight: '60px',
            lineHeight: '1.5'
          }}
        />
        <div style={{ textAlign: 'right', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
          <button
            type="submit"
            className="btn-tweet-submit"
            id="btn-submit-comment"
            disabled={!content.trim()}
          >
            Reply
          </button>
        </div>
      </form>
    </div>
  )
}

export default CommentInput
