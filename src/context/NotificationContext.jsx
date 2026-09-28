import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const navigate = useNavigate()
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Konfirmasi',
    cancelText: 'Batal',
    isDanger: false,
    onConfirm: null
  })
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    featureName: ''
  })

  // Tampilkan notifikasi toast
  const showToast = useCallback((message, type = 'info') => {
    setToast({ visible: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3500)
  }, [])

  // Sembunyikan notifikasi toast
  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }))
  }, [])

  // Tampilkan dialog konfirmasi
  const showConfirm = useCallback(({ title, message, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal', isDanger = false, onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      isDanger,
      onConfirm
    })
  }, [])

  // Tutup dialog konfirmasi
  const closeConfirm = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, onConfirm: null }))
  }, [])

  // Jalankan aksi konfirmasi
  const handleConfirmAction = useCallback(() => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm()
    }
    closeConfirm()
  }, [confirmModal, closeConfirm])

  // Tampilkan modal ajakan login
  const showAuthModal = useCallback((featureName = 'fitur ini') => {
    showToast(`Silakan masuk ke akun Anda terlebih dahulu untuk mengakses ${featureName}`, 'warning')
    setAuthModal({ isOpen: true, featureName })
  }, [showToast])

  // Tutup modal ajakan login
  const closeAuthModal = useCallback(() => {
    setAuthModal({ isOpen: false, featureName: '' })
  }, [])

  return (
    <NotificationContext.Provider value={{ showToast, showConfirm, showAuthModal }}>
      {children}

      {/* Floating In-App Toast Notification */}
      {toast.visible && (
        <div className={`inapp-toast-container toast-type-${toast.type}`}>
          <div className="toast-icon-box">
            {toast.type === 'success' && (
              <svg viewBox="0 0 24 24" className="toast-svg-icon">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg viewBox="0 0 24 24" className="toast-svg-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
            {(toast.type === 'info' || toast.type === 'warning') && (
              <svg viewBox="0 0 24 24" className="toast-svg-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
          </div>
          <span className="toast-message-text">{toast.message}</span>
          <button type="button" onClick={hideToast} className="toast-close-btn">&times;</button>
        </div>
      )}

      {/* Custom In-App Modal Dialog */}
      {confirmModal.isOpen && (
        <div className="inapp-modal-overlay">
          <div className="inapp-modal-card">
            <div className={`modal-header-icon ${confirmModal.isDanger ? 'danger' : 'primary'}`}>
              {confirmModal.isDanger ? (
                <svg viewBox="0 0 24 24" className="modal-svg">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="modal-svg">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>
            <h3 className="modal-title">{confirmModal.title}</h3>
            <p className="modal-message">{confirmModal.message}</p>
            <div className="modal-actions-row">
              <button type="button" onClick={closeConfirm} className="btn-modal-cancel">
                {confirmModal.cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`btn-modal-confirm ${confirmModal.isDanger ? 'btn-danger' : 'btn-primary'}`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Authentication Prompt Modal */}
      {authModal.isOpen && (
        <div className="inapp-modal-overlay">
          <div className="inapp-modal-card auth-required-modal">
            <div className="modal-header-icon primary">
              <svg viewBox="0 0 24 24" className="modal-svg">
                <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
              </svg>
            </div>
            <h3 className="modal-title">Login Diperlukan</h3>
            <p className="modal-message">
              Silakan masuk atau daftar akun GoNect terlebih dahulu untuk mengakses <strong>{authModal.featureName}</strong> dan fitur lengkap komunitas.
            </p>
            <div className="modal-actions-row" style={{ flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  closeAuthModal()
                  navigate('/login')
                }}
                className="btn-modal-confirm btn-primary"
                style={{ width: '100%' }}
              >
                Masuk ke Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  closeAuthModal()
                  navigate('/register')
                }}
                className="btn-modal-cancel"
                style={{ width: '100%', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                Daftar Akun Baru
              </button>
              <button
                type="button"
                onClick={closeAuthModal}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', padding: '6px' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}
