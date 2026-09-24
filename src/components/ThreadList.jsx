import ThreadItem from './ThreadItem'

function ThreadList({ threads = [], authUser, upvote, downvote }) {
  if (threads.length === 0) {
    return (
      <div className="empty-state card">
        <svg className="icon" style={{ width: '48px', height: '48px', color: 'var(--text-muted)', marginBottom: '16px' }} viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <h3>No Threads Found</h3>
        <p>Be the first one to start a discussion!</p>
      </div>
    )
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          id={thread.id}
          title={thread.title}
          body={thread.body}
          category={thread.category}
          createdAt={thread.createdAt}
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          repostsBy={thread.repostsBy || []}
          totalComments={thread.totalComments}
          user={thread.user}
          authUser={authUser}
          upvote={upvote}
          downvote={downvote}
        />
      ))}
    </div>
  )
}

export default ThreadList
