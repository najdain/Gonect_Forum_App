import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RightSidebar from '../components/RightSidebar'
import { asyncPopulateUsersAndThreads } from '../states/shared/action'

function MessagesPage() {
  const dispatch = useDispatch()
  const { threads = [] } = useSelector((state) => state)

  // Ambil data threads jika kosong
  useEffect(() => {
    if (threads.length === 0) {
      dispatch(asyncPopulateUsersAndThreads())
    }
  }, [dispatch, threads.length])

  // Data tiruan percakapan pesan
  const initialChats = [
    {
      id: 'maria',
      user: {
        name: 'Maria',
        handle: '@maria_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        online: true
      },
      lastMessage: 'Keren! Nanti aku coba pelajari lebih lanjut ya. Thanks a lot!',
      time: '10:20',
      unread: false,
      messages: [
        { id: 1, sender: 'maria', text: 'Halo! Suka banget sama utas kamu tentang React 19 & Redux Toolkit kemarin 🚀', time: '10:14' },
        { id: 2, sender: 'maria', text: 'Btw, ada rekomendasi library state management lain yang cocok untuk proyek skala besar?', time: '10:15' },
        { id: 3, sender: 'me', text: 'Halo Maria! Terima kasih ya. Selain Redux Toolkit, Zustand & React Query juga menarik untuk di-explore!', time: '10:18' },
        { id: 4, sender: 'maria', text: 'Keren! Nanti aku coba pelajari lebih lanjut ya. Thanks a lot!', time: '10:20' }
      ]
    },
    {
      id: 'alex',
      user: {
        name: 'Alex Rivera',
        handle: '@alex_tech',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        online: false
      },
      lastMessage: 'Halo bro, ada waktu buat review kode pull request?',
      time: 'Kemarin',
      unread: true,
      messages: [
        { id: 1, sender: 'alex', text: 'Halo bro, ada waktu buat review kode pull request?', time: 'Kemarin 16:30' }
      ]
    },
    {
      id: 'sarah',
      user: {
        name: 'Sarah Chen',
        handle: '@sarah_c',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        online: true
      },
      lastMessage: 'Terima kasih solusinya!',
      time: '2 hari lalu',
      unread: false,
      messages: [
        { id: 1, sender: 'sarah', text: 'Terima kasih solusinya!', time: '2 hari lalu' }
      ]
    }
  ]

  const [activeChatId, setActiveChatId] = useState('maria')
  const [chats, setChats] = useState(initialChats)
  const [inputText, setInputText] = useState('')

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0]

  // Handler kirim pesan obrolan
  function handleSendMessage(e) {
    e.preventDefault()
    if (!inputText.trim()) return

    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: timeStr
    }

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            lastMessage: inputText.trim(),
            time: timeStr,
            messages: [...chat.messages, newMsg]
          }
        }
        return chat
      })
    )

    setInputText('')
  }

  // Kategori unik dari threads
  const categories = Array.from(
    new Set(threads.map((t) => t.category).filter(Boolean))
  )

  return (
    <>
      <main className="middle-feed-column messages-page-column">
        <div className="feed-sticky-header">
          <h1 className="feed-header-title">Pesan Langsung</h1>
        </div>

        <div className="messages-layout-container">
          <div className="messages-contacts-sidebar">
            <div className="messages-search-box">
              <input
                type="text"
                placeholder="Cari obrolan..."
                className="messages-search-input"
              />
            </div>

            <div className="messages-contacts-list">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`message-contact-item ${activeChatId === chat.id ? 'active' : ''}`}
                >
                  <div className="contact-avatar-wrapper">
                    <img src={chat.user.avatar} alt={chat.user.name} className="contact-avatar-img" />
                    {chat.user.online && <span className="contact-online-dot" />}
                  </div>
                  <div className="contact-info-meta">
                    <div className="contact-name-row">
                      <span className="contact-user-name">{chat.user.name}</span>
                      <span className="contact-chat-time">{chat.time}</span>
                    </div>
                    <p className="contact-last-msg">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="messages-chat-window">
            <div className="chat-window-header">
              <img src={activeChat.user.avatar} alt={activeChat.user.name} className="chat-header-avatar" />
              <div className="chat-header-meta">
                <span className="chat-header-name">{activeChat.user.name}</span>
                <span className="chat-header-handle">{activeChat.user.handle} &bull; {activeChat.user.online ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            <div className="chat-messages-body">
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble-wrapper ${msg.sender === 'me' ? 'sent' : 'received'}`}
                >
                  <div className="chat-bubble-content">
                    <p className="chat-bubble-text">{msg.text}</p>
                    <span className="chat-bubble-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-footer">
              <input
                type="text"
                placeholder={`Tulis pesan untuk ${activeChat.user.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="chat-footer-input"
              />
              <button type="submit" className="btn-send-message" disabled={!inputText.trim()}>
                Kirim
              </button>
            </form>
          </div>
        </div>
      </main>

      <RightSidebar categories={categories} />
    </>
  )
}

export default MessagesPage
