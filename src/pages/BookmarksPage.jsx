import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ThreadItem from '../components/ThreadItem'
import RightSidebar from '../components/RightSidebar'
import { asyncPopulateUsersAndThreads } from '../states/shared/action'
import { asyncToggleDownvoteThread, asyncToggleUpvoteThread } from '../states/threads/action'

function BookmarksPage() {
  const dispatch = useDispatch()
  const { threads = [], users = [], authUser = null, bookmarks = [] } = useSelector((state) => state)

  // Ambil data threads & users jika belum ada
  useEffect(() => {
    if (threads.length === 0 || users.length === 0) {
      dispatch(asyncPopulateUsersAndThreads())
    }
  }, [dispatch, threads.length, users.length])

  // Filter utas yang disimpan ke bookmark
  const bookmarkedThreads = threads
    .filter((thread) => bookmarks.includes(thread.id))
    .map((thread) => ({
      ...thread,
      user: users.find((u) => u.id === thread.ownerId) || thread.user
    }))

  // Handler upvote utas
  function handleUpvote(id) {
    dispatch(asyncToggleUpvoteThread(id))
  }

  // Handler downvote utas
  function handleDownvote(id) {
    dispatch(asyncToggleDownvoteThread(id))
  }

  // Kategori unik dari threads
  const categories = Array.from(
    new Set(threads.map((t) => t.category).filter(Boolean))
  )

  return (
    <>
      <main className="middle-feed-column">
        <div className="feed-sticky-header">
          <div className="bookmarks-header-box">
            <h1 className="feed-header-title">Utas Tersimpan</h1>
            <span className="bookmarks-count-sub">{bookmarkedThreads.length} Utas Disimpan</span>
          </div>
        </div>

        <div className="bookmarks-feed-list">
          {bookmarkedThreads.length > 0 ? (
            bookmarkedThreads.map((thread) => (
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
                user={thread.user}
                authUser={authUser}
                upvote={handleUpvote}
                downvote={handleDownvote}
              />
            ))
          ) : (
            <div className="bookmarks-empty-box">
              <svg viewBox="0 0 24 24" className="empty-bookmark-svg">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <p className="empty-bookmark-text">Belum ada utas yang disimpan.</p>
            </div>
          )}
        </div>
      </main>

      <RightSidebar categories={categories} />
    </>
  )
}

export default BookmarksPage
