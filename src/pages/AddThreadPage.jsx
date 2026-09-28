import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import useInput from '../hooks/useInput'
import RightSidebar from '../components/RightSidebar'
import { asyncAddThread } from '../states/threads/action'
import { useNotification } from '../context/NotificationContext'

function AddThreadPage() {
  const { authUser = null, threads = [] } = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useNotification() || {}

  const [title, handleTitleChange] = useInput('')
  const [body, handleBodyChange] = useInput('')
  const [category, handleCategoryChange] = useInput('')
  const [image, setImage] = useState('')
  const [isCompressing, setIsCompressing] = useState(false)

  // Proteksi halaman hanya untuk user login
  useEffect(() => {
    if (!authUser) {
      navigate('/login')
    }
  }, [authUser, navigate])

  // Handler kompresi dan upload gambar
  function handleImageChange(event) {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      if (showToast) showToast('Pilih berkas gambar yang valid (JPG, PNG, GIF).', 'error')
      return
    }

    setIsCompressing(true)
    const reader = new FileReader()
    reader.onload = (e) => {
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
        setImage(dataUrl)
        setIsCompressing(false)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  // Handler hapus gambar
  function handleRemoveImage() {
    setImage('')
  }

  // Handler publikasi utas baru
  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim() || !body.trim() || isCompressing) return

    const finalBody = image ? `${body}\n\n[image-embed]:${image}` : body

    try {
      await dispatch(asyncAddThread({ title, body: finalBody, category }))
      if (showToast) showToast('Utas baru berhasil dipublikasikan! (+10 Poin)', 'success')
      navigate('/')
    } catch (error) {
    }
  }

  const categories = Array.from(
    new Set(threads.map((t) => t.category).filter(Boolean))
  )

  if (!authUser) return null

  return (
    <>
      <main className="middle-feed-column">
        <div className="feed-sticky-header">
          <div className="profile-header-flex">
            <Link to="/" className="profile-back-btn" title="Kembali">
              <svg viewBox="0 0 24 24" className="action-icon-svg">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
            <h1 className="feed-header-title" style={{ fontSize: '18px' }}>Buat Utas Baru</h1>
          </div>
        </div>

        <div className="thread-form-container">
          <form onSubmit={handleSubmit} className="thread-form">
            <div className="form-group">
              <label htmlFor="thread-title" className="form-label">
                Judul Utas
              </label>
              <input
                id="thread-title"
                type="text"
                className="form-input"
                placeholder="Masukkan judul topik pembahasan..."
                value={title}
                onChange={handleTitleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="thread-category" className="form-label">
                Kategori / Topik
              </label>
              <input
                id="thread-category"
                type="text"
                className="form-input"
                placeholder="misal: react, frontend, webdev"
                value={category}
                onChange={handleCategoryChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="thread-body" className="form-label">
                Isi Utas / Pembahasan
              </label>
              <textarea
                id="thread-body"
                className="form-input"
                placeholder="Tuliskan pemikiran atau penjelasan topik yang ingin Anda bagikan..."
                value={body}
                onChange={handleBodyChange}
                required
              />
            </div>

            {/* Image Attachment Area */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Lampirkan Gambar (Opsional)</label>
              {!image ? (
                <div className="image-dropzone-box">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="dropzone-file-input"
                  />
                  <svg viewBox="0 0 24 24" className="dropzone-icon">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p className="dropzone-text">
                    {isCompressing ? 'Memproses gambar...' : 'Klik atau seret gambar ke sini untuk melampirkan'}
                  </p>
                  <span className="dropzone-subtext">Mendukung format JPG, PNG, GIF</span>
                </div>
              ) : (
                <div className="image-preview-wrapper">
                  <img src={image} alt="attached preview" className="image-preview-img" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-remove-preview-img"
                    title="Hapus gambar"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-tweet-submit"
              id="btn-submit-thread"
              disabled={isCompressing || !title.trim() || !body.trim()}
            >
              Publikasikan Utas
            </button>
          </form>
        </div>
      </main>

      <RightSidebar categories={categories} />
    </>
  )
}

export default AddThreadPage
