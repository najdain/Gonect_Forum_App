import CommentItem from './CommentItem'

function CommentList({ comments = [], authUser, upvoteComment, downvoteComment, addComment }) {
  if (comments.length === 0) {
    return (
      <div className="empty-state">
        <p>No comments yet. Start the conversation!</p>
      </div>
    )
  }

  return (
    <div className="comment-list" id="comments">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          content={comment.content}
          createdAt={comment.createdAt}
          owner={comment.owner}
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
          authUser={authUser}
          upvote={upvoteComment}
          downvote={downvoteComment}
          addComment={addComment}
        />
      ))}
    </div>
  )
}

export default CommentList
