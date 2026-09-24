import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import ThreadList from '../components/ThreadList'
import RightSidebar from '../components/RightSidebar'
import { asyncPopulateUsersAndThreads } from '../states/shared/action'
import { asyncToggleDownvoteThread, asyncToggleUpvoteThread, asyncAddThread } from '../states/threads/action'
import { useNotification } from '../context/NotificationContext'

function HomePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showAuthModal } = useNotification() || {}
  const { threads = [], users = [], authUser = null } = useSelector((state) => state)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  // State for Inline Threads Composer ("Apa yang baru?")
  const [inlineTitle, setInlineTitle] = useState('')
  const [inlineBody, setInlineBody] = useState('')
  const [inlineCategory, setInlineCategory] = useState('')
  const [inlineImage, setInlineImage] = useState('')
  const [isSubmittingInline, setIsSubmittingInline] = useState(false)

  useEffect(() => {
    if (threads.length === 0) {
      dispatch(asyncPopulateUsersAndThreads())
    }
  }, [dispatch, threads.length])

  // Combine threads with user profile details
  const threadList = threads.map((thread) => {
    let author = users.find((u) => u.id === thread.ownerId)
    if (authUser && thread.ownerId === authUser.id) {
      author = { ...author, ...authUser }
    }
    return {
      ...thread,
      user: author
    }
  })

  // Extract unique categories
  const categories = Array.from(
    new Set(threads.map((t) => t.category).filter(Boolean))
  )

  // Filter threads by category and search query
  const filteredThreads = threadList.filter((t) => {
    const matchesCategory = selectedCategory ? t.category === selectedCategory : true
    const matchesSearch = searchQuery
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.body.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  // Sort threads based on sortBy state
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (sortBy === 'top') {
      const netA = a.upVotesBy.length - a.downVotesBy.length
      const netB = b.upVotesBy.length - b.downVotesBy.length
      return netB - netA
    }
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const displayedThreads = sortedThreads

  function handleUpvote(id) {
    if (!authUser) {
      if (showAuthModal) showAuthModal('menyukai utas')
      return
    }
    dispatch(asyncToggleUpvoteThread(id))
  }

  function handleDownvote(id) {
    if (!authUser) {
      if (showAuthModal) showAuthModal('memberi tidak suka pada utas')
      return
    }
    dispatch(asyncToggleDownvoteThread(id))
  }

  function handleInlineImageChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 600
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
        setInlineImage(dataUrl)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  async function handleInlineSubmit(e) {
    e.preventDefault()
    if (!authUser) {
      if (showAuthModal) showAuthModal('membuat utas baru')
      return
    }
    if (!inlineBody.trim() || isSubmittingInline) return

    setIsSubmittingInline(true)
    const titleToUse = inlineTitle.trim() || inlineBody.slice(0, 30) + '...'
    const finalBody = inlineImage ? `${inlineBody}\n\n[image-embed]:${inlineImage}` : inlineBody

    try {
      await dispatch(asyncAddThread({ title: titleToUse, body: finalBody, category: inlineCategory }))
      setInlineTitle('')
      setInlineBody('')
      setInlineCategory('')
      setInlineImage('')
    } finally {
      setIsSubmittingInline(false)
    }
  }

  return (
    <>
      {/* Middle Feed Column */}
      <main className="middle-feed-column">
        
        {/* Sticky Feed Header (Meta Threads Style: "Untuk Anda") */}
        <div className="threads-feed-header">
          <h1 className="threads-header-title">
            {selectedCategory ? `#${selectedCategory}` : 'Untuk Anda'}
          </h1>
          <button type="button" className="btn-threads-header-more" title="More Options">
            <svg viewBox="0 0 24 24" className="threads-header-icon">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
        </div>

        {/* Timeline Posts List */}
        <ThreadList
          threads={displayedThreads}
          authUser={authUser}
          upvote={handleUpvote}
          downvote={handleDownvote}
        />

        {/* Guest Call to Action Banner when not logged in */}
        {!authUser && (
          <div className="guest-feed-banner">
            <h3>Ingin melihat seluruh utas dan diskusi?</h3>
            <p>Silakan masuk atau daftar akun GoNect untuk membaca seluruh percakapan dan berpartisipasi dalam diskusi.</p>
            <div className="guest-feed-actions">
              <Link to="/login" className="btn-guest-login">Masuk</Link>
              <Link to="/register" className="btn-guest-register">Daftar Akun</Link>
            </div>
          </div>
        )}

        {/* Floating Action Button (+) at Bottom Right */}
        <button
          type="button"
          onClick={() => {
            if (!authUser) {
              if (showAuthModal) showAuthModal('fitur Buat Utas')
              else navigate('/login')
            } else {
              navigate('/new')
            }
          }}
          className="threads-fab-btn"
          title="Utas baru"
        >
          +
        </button>
      </main>


      {/* Right Sidebar Widgets */}
      <RightSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </>
  )
}

export default HomePage
